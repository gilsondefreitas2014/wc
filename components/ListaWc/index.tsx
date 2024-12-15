import React from "react";
import { View, Text, Button } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { styles } from "./styles";

type Props = {
  item: { id: string; ocupado: boolean; };
  handleUpdated: (updatedItem: { id: string; ocupado: boolean }) => void;
};

export default function ListaWc({ item, handleUpdated }: Props) {
  return (
    <View style={styles.taskContainer}>
      <MaterialIcons 
        name="wc" 
        size={48} 
        color={item.ocupado ? "red" : "green"} 
      />

      <Text style={styles.task}>{item.id}</Text>

      <Text style={styles.task}>
        {item.ocupado ? "Ocupado" : "Livre"}
      </Text>

      <Button 
        title={item.ocupado ? "Liberar" : "Reservar"} 
        onPress={() => handleUpdated({ id: item.id, ocupado: !item.ocupado })} 
      />

    </View>
  );
}
