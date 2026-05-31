import { ScrollView, Text, View, TouchableOpacity, ActivityIndicator, RefreshControl } from "react-native";
import { useState, useEffect } from "react";

import { ScreenContainer } from "@/components/screen-container";
import {
  compareDeploymentCosts,
  formatGasPrice,
  formatEth,
  formatUsd,
  getSpeedRecommendation,
  getDeploymentWarning,
  type GasEstimate,
} from "@/lib/utils/gas-estimator";

/**
 * Gas Estimator Screen - Calculate deployment costs for both networks
 */
export default function GasEstimatorScreen() {
  const [activeNetwork, setActiveNetwork] = useState<"sepolia" | "mainnet">("sepolia");
  const [sepoliaEstimate, setSepoliaEstimate] = useState<GasEstimate | null>(null);
  const [mainnetEstimate, setMainnetEstimate] = useState<GasEstimate | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadEstimates();
  }, []);

  const loadEstimates = async () => {
    try {
      setLoading(true);
      setError(null);
      const estimates = await compareDeploymentCosts();
      setSepoliaEstimate(estimates.sepolia);
      setMainnetEstimate(estimates.mainnet);
    } catch (err) {
      console.error("Failed to load gas estimates:", err);
      setError("Failed to load gas prices. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadEstimates();
    setRefreshing(false);
  };

  const currentEstimate = activeNetwork === "sepolia" ? sepoliaEstimate : mainnetEstimate;

  if (loading) {
    return (
      <ScreenContainer className="p-4">
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#0a7ea4" />
          <Text className="text-foreground mt-4">Loading gas prices...</Text>
        </View>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer className="p-4">
      <ScrollView
        contentContainerStyle={{ paddingBottom: 30 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {/* Header */}
        <View className="mb-6">
          <Text className="text-2xl font-bold text-foreground mb-2">Gas Fee Estimator</Text>
          <Text className="text-sm text-muted">
            Estimate deployment costs for your ERC-20 token
          </Text>
        </View>

        {/* Error Message */}
        {error && (
          <View className="bg-error rounded-lg p-4 mb-4">
            <Text className="text-background text-sm">{error}</Text>
          </View>
        )}

        {/* Network Selector */}
        <View className="flex-row gap-3 mb-6">
          <TouchableOpacity
            onPress={() => setActiveNetwork("sepolia")}
            className={`flex-1 rounded-lg p-4 active:opacity-80 ${
              activeNetwork === "sepolia" ? "bg-warning" : "bg-surface border border-border"
            }`}
          >
            <Text
              className={`font-semibold text-center ${
                activeNetwork === "sepolia" ? "text-background" : "text-foreground"
              }`}
            >
              Sepolia (Testnet)
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setActiveNetwork("mainnet")}
            className={`flex-1 rounded-lg p-4 active:opacity-80 ${
              activeNetwork === "mainnet" ? "bg-error" : "bg-surface border border-border"
            }`}
          >
            <Text
              className={`font-semibold text-center ${
                activeNetwork === "mainnet" ? "text-background" : "text-foreground"
              }`}
            >
              Mainnet (Production)
            </Text>
          </TouchableOpacity>
        </View>

        {/* Warning Banner */}
        {currentEstimate && getDeploymentWarning(currentEstimate) && (
          <View className="bg-warning rounded-lg p-4 mb-4">
            <Text className="text-background text-sm">{getDeploymentWarning(currentEstimate)}</Text>
          </View>
        )}

        {/* Current Network Info */}
        {currentEstimate && (
          <View className="bg-surface rounded-lg p-4 border border-border mb-6">
            <View className="flex-row justify-between items-center mb-3">
              <Text className="text-foreground font-semibold">Network Information</Text>
              <Text className="text-xs text-muted">
                Updated {new Date(currentEstimate.timestamp).toLocaleTimeString()}
              </Text>
            </View>

            <View className="gap-2">
              <View className="flex-row justify-between">
                <Text className="text-muted">ETH Price:</Text>
                <Text className="text-foreground font-medium">${currentEstimate.ethPrice.toFixed(2)}</Text>
              </View>
              <View className="flex-row justify-between">
                <Text className="text-muted">Estimated Gas:</Text>
                <Text className="text-foreground font-medium">{currentEstimate.estimatedGas.toLocaleString()}</Text>
              </View>
            </View>
          </View>
        )}

        {/* Gas Price Tiers */}
        {currentEstimate && (
          <View className="mb-6">
            <Text className="text-lg font-semibold text-foreground mb-4">Deployment Cost Estimates</Text>

            {/* Standard */}
            <GasPriceTierCard
              tier="standard"
              gasPrice={currentEstimate.gasPrice.standard}
              costEth={currentEstimate.estimatedCostEth.standard}
              costUsd={currentEstimate.estimatedCostUsd.standard}
            />

            {/* Fast */}
            <GasPriceTierCard
              tier="fast"
              gasPrice={currentEstimate.gasPrice.fast}
              costEth={currentEstimate.estimatedCostEth.fast}
              costUsd={currentEstimate.estimatedCostUsd.fast}
            />

            {/* Urgent */}
            <GasPriceTierCard
              tier="urgent"
              gasPrice={currentEstimate.gasPrice.urgent}
              costEth={currentEstimate.estimatedCostEth.urgent}
              costUsd={currentEstimate.estimatedCostUsd.urgent}
            />
          </View>
        )}

        {/* Comparison Section */}
        {sepoliaEstimate && mainnetEstimate && (
          <View className="bg-surface rounded-lg p-4 border border-border">
            <Text className="text-lg font-semibold text-foreground mb-4">Network Comparison</Text>

            <View className="gap-3">
              <ComparisonRow
                label="Standard Cost"
                sepoliaValue={sepoliaEstimate.estimatedCostEth.standard}
                mainnetValue={mainnetEstimate.estimatedCostEth.standard}
              />
              <ComparisonRow
                label="Fast Cost"
                sepoliaValue={sepoliaEstimate.estimatedCostEth.fast}
                mainnetValue={mainnetEstimate.estimatedCostEth.fast}
              />
              <ComparisonRow
                label="Urgent Cost"
                sepoliaValue={sepoliaEstimate.estimatedCostEth.urgent}
                mainnetValue={mainnetEstimate.estimatedCostEth.urgent}
              />
            </View>

            <View className="mt-4 pt-4 border-t border-border">
              <Text className="text-xs text-muted leading-relaxed">
                💡 Sepolia is for testing with free test ETH. Mainnet requires real ETH and is permanent.
              </Text>
            </View>
          </View>
        )}

        {/* Info Section */}
        <View className="mt-6 bg-surface rounded-lg p-4 border border-border">
          <Text className="text-sm font-semibold text-foreground mb-2">ℹ️ About Gas Fees</Text>
          <Text className="text-xs text-muted leading-relaxed">
            Gas fees are paid to miners/validators to process your transaction. Higher gas prices result in faster
            confirmation. These estimates are based on current network conditions and may vary.
          </Text>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}

/**
 * Gas Price Tier Card Component
 */
function GasPriceTierCard({
  tier,
  gasPrice,
  costEth,
  costUsd,
}: {
  tier: "standard" | "fast" | "urgent";
  gasPrice: string;
  costEth: string;
  costUsd: string;
}) {
  const recommendation = getSpeedRecommendation(tier);
  const bgColor =
    tier === "standard" ? "bg-surface" : tier === "fast" ? "bg-success/10" : "bg-warning/10";
  const borderColor =
    tier === "standard" ? "border-border" : tier === "fast" ? "border-success" : "border-warning";

  return (
    <View className={`${bgColor} rounded-lg p-4 mb-3 border ${borderColor}`}>
      <View className="flex-row justify-between items-start mb-2">
        <View>
          <Text className="text-foreground font-semibold">{recommendation.label}</Text>
          <Text className="text-xs text-muted mt-1">{recommendation.description}</Text>
        </View>
        <Text className="text-xs text-muted">{recommendation.time}</Text>
      </View>

      <View className="mt-3 pt-3 border-t border-border/50 gap-2">
        <View className="flex-row justify-between">
          <Text className="text-muted text-sm">Gas Price:</Text>
          <Text className="text-foreground font-medium text-sm">{formatGasPrice(gasPrice)}</Text>
        </View>
        <View className="flex-row justify-between">
          <Text className="text-muted text-sm">Cost (ETH):</Text>
          <Text className="text-foreground font-bold text-sm">{formatEth(costEth)}</Text>
        </View>
        <View className="flex-row justify-between">
          <Text className="text-muted text-sm">Cost (USD):</Text>
          <Text className="text-foreground font-bold text-sm">{formatUsd(costUsd)}</Text>
        </View>
      </View>
    </View>
  );
}

/**
 * Network Comparison Row Component
 */
function ComparisonRow({
  label,
  sepoliaValue,
  mainnetValue,
}: {
  label: string;
  sepoliaValue: string;
  mainnetValue: string;
}) {
  const sepoliaNum = parseFloat(sepoliaValue);
  const mainnetNum = parseFloat(mainnetValue);
  const difference = mainnetNum - sepoliaNum;
  const percentDifference = ((difference / sepoliaNum) * 100).toFixed(0);

  return (
    <View className="flex-row justify-between items-center py-2 border-b border-border/50 last:border-b-0">
      <Text className="text-muted text-sm">{label}</Text>
      <View className="flex-row gap-4 items-center">
        <View className="items-end">
          <Text className="text-foreground text-sm font-medium">{formatEth(sepoliaValue)}</Text>
          <Text className="text-xs text-muted">Sepolia</Text>
        </View>
        <View className="items-end">
          <Text className="text-foreground text-sm font-medium">{formatEth(mainnetValue)}</Text>
          <Text className="text-xs text-muted">Mainnet</Text>
        </View>
        <View className="items-end min-w-12">
          <Text className={`text-xs font-semibold ${difference > 0 ? "text-error" : "text-success"}`}>
            {difference > 0 ? "+" : ""}{difference.toFixed(6)} ETH
          </Text>
          <Text className="text-xs text-muted">{percentDifference}%</Text>
        </View>
      </View>
    </View>
  );
}
