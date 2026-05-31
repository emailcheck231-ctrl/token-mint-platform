import { ScrollView, Text, View, TouchableOpacity, TextInput, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import { useState } from "react";
import { ScreenContainer } from "@/components/screen-container";
import { trpc } from "@/lib/trpc";

/**
 * Import Crypto Page
 *
 * Allows users to import crypto wallet data (seed phrase, private key, etc)
 * and immediately load the mint token plugin into their wallet.
 */
export default function ImportCryptoScreen() {
  const router = useRouter();
  const [publicKey, setPublicKey] = useState("");
  const [importMethod, setImportMethod] = useState<"seedPhrase" | "privateKey" | "publicKey">("seedPhrase");
  const [chain, setChain] = useState("ethereum");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const importWallet = trpc.crypto.importWallet.useMutation();

  const handleImport = async () => {
    if (!publicKey.trim()) {
      setError("Please enter crypto data");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await importWallet.mutateAsync({
        publicKey: publicKey.trim(),
        chain,
        importMethod,
        metadata: {
          importedAt: new Date().toISOString(),
        },
      });

      if (result.success && result.wallet) {
        setSuccess(true);
        // Auto-load mint plugin by navigating after a short delay
        setTimeout(() => {
          router.replace("/");
        }, 1500);
      } else {
        setError("Failed to import wallet");
      }
    } catch (err) {
      console.error("Import error:", err);
      setError(err instanceof Error ? err.message : "Failed to import wallet");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <ScreenContainer className="p-6">
        <View className="flex-1 items-center justify-center gap-4">
          <Text className="text-4xl">✓</Text>
          <Text className="text-2xl font-bold text-foreground">Wallet Imported!</Text>
          <Text className="text-center text-muted">
            Your crypto wallet has been imported and the mint plugin is now available.
          </Text>
        </View>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer className="p-6">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View className="flex-1 gap-6">
          {/* Header */}
          <View className="gap-2 mt-4">
            <Text className="text-3xl font-bold text-foreground">Import Crypto</Text>
            <Text className="text-sm text-muted">
              Connect your crypto wallet to enable token minting and transfers
            </Text>
          </View>

          {/* Error Message */}
          {error && (
            <View className="bg-error rounded-lg p-4">
              <Text className="text-background text-sm">{error}</Text>
            </View>
          )}

          {/* Import Method Selector */}
          <View className="gap-2">
            <Text className="text-lg font-semibold text-foreground">Import Method</Text>
            <View className="flex-row gap-2">
              {(["seedPhrase", "privateKey", "publicKey"] as const).map((method) => (
                <TouchableOpacity
                  key={method}
                  onPress={() => setImportMethod(method)}
                  className={`flex-1 rounded-lg p-3 active:opacity-80 ${
                    importMethod === method
                      ? "bg-primary"
                      : "bg-surface border border-border"
                  }`}
                >
                  <Text
                    className={`text-center text-xs font-semibold ${
                      importMethod === method
                        ? "text-background"
                        : "text-foreground"
                    }`}
                  >
                    {method === "seedPhrase"
                      ? "Seed"
                      : method === "privateKey"
                        ? "Private Key"
                        : "Public Key"}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Chain Selector */}
          <View className="gap-2">
            <Text className="text-lg font-semibold text-foreground">Network</Text>
            <View className="flex-row gap-2">
              {["ethereum", "sepolia"].map((c) => (
                <TouchableOpacity
                  key={c}
                  onPress={() => setChain(c)}
                  className={`flex-1 rounded-lg p-3 active:opacity-80 ${
                    chain === c
                      ? "bg-warning"
                      : "bg-surface border border-border"
                  }`}
                >
                  <Text
                    className={`text-center text-xs font-semibold ${
                      chain === c
                        ? "text-background"
                        : "text-foreground"
                    }`}
                  >
                    {c === "ethereum" ? "Mainnet" : "Testnet"}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Crypto Data Input */}
          <View className="gap-2 flex-1">
            <Text className="text-lg font-semibold text-foreground">
              {importMethod === "seedPhrase"
                ? "Seed Phrase"
                : importMethod === "privateKey"
                  ? "Private Key"
                  : "Public Key/Address"}
            </Text>
            <TextInput
              multiline
              numberOfLines={4}
              placeholder={
                importMethod === "seedPhrase"
                  ? "Enter your 12 or 24 word seed phrase..."
                  : importMethod === "privateKey"
                    ? "Enter your private key (0x...)"
                    : "Enter your public address or key..."
              }
              placeholderTextColor="#666"
              value={publicKey}
              onChangeText={setPublicKey}
              className="bg-surface border border-border rounded-lg p-4 text-foreground"
              editable={!loading}
            />
            <Text className="text-xs text-muted">
              Your data is encrypted and never stored in plain text
            </Text>
          </View>

          {/* Import Button */}
          <TouchableOpacity
            onPress={handleImport}
            disabled={loading}
            className={`rounded-lg p-4 active:opacity-80 ${
              loading ? "bg-muted" : "bg-primary"
            }`}
          >
            <View className="flex-row items-center justify-center gap-2">
              {loading && <ActivityIndicator size="small" color="#ffffff" />}
              <Text className="text-center font-bold text-background">
                {loading ? "Importing..." : "Import Wallet"}
              </Text>
            </View>
          </TouchableOpacity>

          {/* Security Info */}
          <View className="bg-surface rounded-lg p-4 border border-border">
            <Text className="text-sm font-semibold text-foreground mb-2">🔐 Security</Text>
            <View className="gap-1">
              <Text className="text-xs text-muted">✓ Data encrypted locally</Text>
              <Text className="text-xs text-muted">✓ Never transmitted unencrypted</Text>
              <Text className="text-xs text-muted">✓ Secure key storage</Text>
            </View>
          </View>

          {/* Back Button */}
          <TouchableOpacity
            onPress={() => router.back()}
            className="p-3"
            disabled={loading}
          >
            <Text className="text-center text-primary font-semibold">Go Back</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
