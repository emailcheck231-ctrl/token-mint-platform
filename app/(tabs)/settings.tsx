import { ScrollView, Text, View, TouchableOpacity, TextInput, Switch } from "react-native";
import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { ScreenContainer } from "@/components/screen-container";
import { useColorScheme } from "@/hooks/use-color-scheme";

/**
 * Settings Screen - Configure RPC URLs, private key, and app preferences
 */
export default function SettingsScreen() {
  const colorScheme = useColorScheme();
  const [sepoliaRpc, setSepoliaRpc] = useState("");
  const [mainnetRpc, setMainnetRpc] = useState("");
  const [privateKey, setPrivateKey] = useState("");
  const [showPrivateKey, setShowPrivateKey] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(colorScheme === "dark");

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const [sepolia, mainnet, pk, notif] = await Promise.all([
        AsyncStorage.getItem("sepolia_rpc"),
        AsyncStorage.getItem("mainnet_rpc"),
        AsyncStorage.getItem("private_key"),
        AsyncStorage.getItem("notifications_enabled"),
      ]);
      if (sepolia) setSepoliaRpc(sepolia);
      if (mainnet) setMainnetRpc(mainnet);
      if (pk) setPrivateKey(pk);
      if (notif) setNotificationsEnabled(JSON.parse(notif));
    } catch (error) {
      console.error("Failed to load settings:", error);
    }
  };

  const saveSettings = async () => {
    try {
      await Promise.all([
        AsyncStorage.setItem("sepolia_rpc", sepoliaRpc),
        AsyncStorage.setItem("mainnet_rpc", mainnetRpc),
        AsyncStorage.setItem("private_key", privateKey),
        AsyncStorage.setItem("notifications_enabled", JSON.stringify(notificationsEnabled)),
      ]);
      alert("Settings saved successfully!");
    } catch (error) {
      console.error("Failed to save settings:", error);
      alert("Failed to save settings");
    }
  };

  return (
    <ScreenContainer className="p-4">
      <ScrollView contentContainerStyle={{ paddingBottom: 30 }}>
        <Text className="text-2xl font-bold text-foreground mb-6">Settings</Text>

        {/* Environment Configuration Section */}
        <View className="mb-8">
          <Text className="text-lg font-semibold text-foreground mb-4">Environment Configuration</Text>

          {/* Sepolia RPC */}
          <View className="mb-4">
            <Text className="text-sm font-medium text-foreground mb-2">Sepolia RPC URL</Text>
            <TextInput
              placeholder="https://sepolia.infura.io/v3/YOUR_KEY"
              placeholderTextColor="#687076"
              value={sepoliaRpc}
              onChangeText={setSepoliaRpc}
              className="bg-surface border border-border rounded-lg px-4 py-3 text-foreground"
              editable
            />
            <Text className="text-xs text-muted mt-1">
              Get a free RPC URL from Infura, Alchemy, or QuickNode
            </Text>
          </View>

          {/* Mainnet RPC */}
          <View className="mb-4">
            <Text className="text-sm font-medium text-foreground mb-2">Mainnet RPC URL</Text>
            <TextInput
              placeholder="https://mainnet.infura.io/v3/YOUR_KEY"
              placeholderTextColor="#687076"
              value={mainnetRpc}
              onChangeText={setMainnetRpc}
              className="bg-surface border border-border rounded-lg px-4 py-3 text-foreground"
              editable
            />
            <Text className="text-xs text-muted mt-1">
              ⚠️ Use for production deployments only
            </Text>
          </View>

          {/* Private Key */}
          <View className="mb-4">
            <Text className="text-sm font-medium text-foreground mb-2">Private Key</Text>
            <View className="flex-row items-center">
              <TextInput
                placeholder="0x..."
                placeholderTextColor="#687076"
                value={showPrivateKey ? privateKey : "•".repeat(privateKey.length || 10)}
                onChangeText={setPrivateKey}
                className="flex-1 bg-surface border border-border rounded-lg px-4 py-3 text-foreground"
                secureTextEntry={!showPrivateKey}
                editable
              />
              <TouchableOpacity
                onPress={() => setShowPrivateKey(!showPrivateKey)}
                className="ml-2 p-2"
              >
                <Text className="text-primary font-semibold text-sm">
                  {showPrivateKey ? "Hide" : "Show"}
                </Text>
              </TouchableOpacity>
            </View>
            <Text className="text-xs text-error mt-1">
              ⚠️ Never share your private key. Store it securely.
            </Text>
          </View>

          {/* Save Button */}
          <TouchableOpacity
            onPress={saveSettings}
            className="bg-primary rounded-lg px-6 py-3 mt-4 active:opacity-80"
          >
            <Text className="text-background font-semibold text-center">Save Configuration</Text>
          </TouchableOpacity>
        </View>

        {/* App Preferences Section */}
        <View className="mb-8">
          <Text className="text-lg font-semibold text-foreground mb-4">App Preferences</Text>

          {/* Dark Mode Toggle */}
          <View className="flex-row justify-between items-center bg-surface rounded-lg p-4 mb-3 border border-border">
            <Text className="text-foreground font-medium">Dark Mode</Text>
            <Switch
              value={isDarkMode}
              onValueChange={setIsDarkMode}
              trackColor={{ false: "#e5e7eb", true: "#0a7ea4" }}
              thumbColor={isDarkMode ? "#0a7ea4" : "#f5f5f5"}
            />
          </View>

          {/* Notifications Toggle */}
          <View className="flex-row justify-between items-center bg-surface rounded-lg p-4 border border-border">
            <Text className="text-foreground font-medium">Notifications</Text>
            <Switch
              value={notificationsEnabled}
              onValueChange={setNotificationsEnabled}
              trackColor={{ false: "#e5e7eb", true: "#0a7ea4" }}
              thumbColor={notificationsEnabled ? "#0a7ea4" : "#f5f5f5"}
            />
          </View>
        </View>

        {/* About Section */}
        <View className="border-t border-border pt-6">
          <Text className="text-lg font-semibold text-foreground mb-4">About</Text>

          <View className="bg-surface rounded-lg p-4 border border-border gap-3">
            <View className="flex-row justify-between">
              <Text className="text-foreground font-medium">App Version</Text>
              <Text className="text-muted">1.0.0</Text>
            </View>

            <TouchableOpacity className="py-2">
              <Text className="text-primary font-semibold">GitHub Repository</Text>
            </TouchableOpacity>

            <TouchableOpacity className="py-2">
              <Text className="text-primary font-semibold">Documentation</Text>
            </TouchableOpacity>

            <TouchableOpacity className="py-2">
              <Text className="text-primary font-semibold">Send Feedback</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
