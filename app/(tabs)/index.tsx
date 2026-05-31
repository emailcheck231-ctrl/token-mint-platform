import { ScrollView, Text, View, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";

import { ScreenContainer } from "@/components/screen-container";

/**
 * Home Screen - TokenMint Platform
 *
 * Main entry point showing platform overview and quick actions.
 */
export default function HomeScreen() {
  const router = useRouter();

  const handleStartProject = () => {
    // Navigate to project setup wizard
    console.log("Navigate to project setup");
  };

  const handleViewProjects = () => {
    // Navigate to projects list
    console.log("Navigate to projects");
  };

  const handleLearnHardhat = () => {
    // Open documentation or guide
    console.log("Navigate to learning resources");
  };

  return (
    <ScreenContainer className="p-6">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View className="flex-1 gap-8">
          {/* Hero Section */}
          <View className="items-center gap-3 mt-4">
            <Text className="text-5xl font-bold text-foreground">TokenMint</Text>
            <Text className="text-lg text-muted text-center">
              Create & Deploy ERC-20 Tokens on Ethereum
            </Text>
          </View>

          {/* Quick Action Cards */}
          <View className="gap-4 mt-4">
            {/* Start New Project Card */}
            <TouchableOpacity
              onPress={handleStartProject}
              className="bg-primary rounded-2xl p-6 active:opacity-80"
            >
              <Text className="text-xl font-bold text-background mb-2">Start New Project</Text>
              <Text className="text-sm text-background opacity-90">
                Create a new ERC-20 token with step-by-step guidance
              </Text>
            </TouchableOpacity>

            {/* View My Tokens Card */}
            <TouchableOpacity
              onPress={handleViewProjects}
              className="bg-surface rounded-2xl p-6 border border-border active:opacity-70"
            >
              <Text className="text-lg font-semibold text-foreground mb-2">View My Tokens</Text>
              <Text className="text-sm text-muted">
                Manage your deployed tokens and projects
              </Text>
            </TouchableOpacity>

            {/* Learn Hardhat Card */}
            <TouchableOpacity
              onPress={handleLearnHardhat}
              className="bg-surface rounded-2xl p-6 border border-border active:opacity-70"
            >
              <Text className="text-lg font-semibold text-foreground mb-2">Learn Hardhat</Text>
              <Text className="text-sm text-muted">
                Explore deployment guides and best practices
              </Text>
            </TouchableOpacity>

            {/* Gas Estimator Card */}
            <TouchableOpacity
              onPress={() => console.log("Navigate to gas estimator")}
              className="bg-surface rounded-2xl p-6 border border-border active:opacity-70"
            >
              <Text className="text-lg font-semibold text-foreground mb-2">Estimate Gas Fees</Text>
              <Text className="text-sm text-muted">
                Calculate deployment costs on Sepolia and Mainnet
              </Text>
            </TouchableOpacity>
          </View>

          {/* Info Section */}
          <View className="bg-surface rounded-2xl p-4 border border-border mt-4">
            <Text className="text-sm font-semibold text-foreground mb-2">🔒 Safe & Secure</Text>
            <Text className="text-xs text-muted leading-relaxed">
              Test on Sepolia testnet before deploying to Ethereum mainnet. All deployments use
              industry-standard OpenZeppelin contracts.
            </Text>
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
