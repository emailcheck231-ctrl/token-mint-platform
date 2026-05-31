import { FlatList, Text, View, TouchableOpacity, TextInput } from "react-native";
import { useState, useMemo } from "react";

import { ScreenContainer } from "@/components/screen-container";
import { useTokenProjects } from "@/lib/context/token-context";

/**
 * Projects List Screen - Browse and manage all token projects
 */
export default function ProjectsScreen() {
  const { projects } = useTokenProjects();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredProjects = useMemo(() => {
    return projects.filter(
      (p) =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.tokenSymbol.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [projects, searchQuery]);

  const getNetworkBadgeColor = (network: string) => {
    return network === "sepolia" ? "bg-warning" : "bg-error";
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "deployed":
      case "active":
        return "text-success";
      case "deploying":
        return "text-warning";
      default:
        return "text-muted";
    }
  };

  const renderProjectCard = ({ item }: { item: any }) => (
    <TouchableOpacity className="bg-surface rounded-xl p-4 mb-3 border border-border active:opacity-70">
      <View className="flex-row justify-between items-start mb-2">
        <View className="flex-1">
          <Text className="text-lg font-semibold text-foreground">{item.name}</Text>
          <Text className="text-sm text-muted">{item.tokenName}</Text>
        </View>
        <View className={`${getNetworkBadgeColor(item.network)} rounded-full px-3 py-1`}>
          <Text className="text-xs font-semibold text-background capitalize">
            {item.network}
          </Text>
        </View>
      </View>

      <View className="flex-row justify-between items-center">
        <View className="flex-row gap-2 items-center">
          <Text className="text-sm font-medium text-foreground">{item.tokenSymbol}</Text>
          <Text className="text-xs text-muted">•</Text>
          <Text className={`text-xs font-semibold ${getStatusColor(item.status)}`}>
            {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
          </Text>
        </View>
        {item.contractAddress && (
          <Text className="text-xs text-muted">
            {item.contractAddress.slice(0, 6)}...{item.contractAddress.slice(-4)}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <ScreenContainer className="p-4">
      <View className="mb-4">
        <Text className="text-2xl font-bold text-foreground mb-4">My Projects</Text>

        {/* Search Bar */}
        <TextInput
          placeholder="Search projects..."
          placeholderTextColor="#687076"
          value={searchQuery}
          onChangeText={setSearchQuery}
          className="bg-surface border border-border rounded-lg px-4 py-3 text-foreground"
        />
      </View>

      {filteredProjects.length === 0 ? (
        <View className="flex-1 items-center justify-center gap-4">
          <Text className="text-lg font-semibold text-foreground">No Projects Yet</Text>
          <Text className="text-sm text-muted text-center">
            Create your first ERC-20 token project to get started
          </Text>
          <TouchableOpacity className="bg-primary rounded-lg px-6 py-3 mt-4">
            <Text className="text-background font-semibold">Create Project</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={filteredProjects}
          renderItem={renderProjectCard}
          keyExtractor={(item) => item.id}
          scrollEnabled={false}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      )}
    </ScreenContainer>
  );
}
