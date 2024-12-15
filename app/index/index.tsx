import React, { useState, useEffect } from "react";
import { Alert, Text, TextInput, View, Button, FlatList } from "react-native";

// Estilos
import { styles } from "./styles";
import ListaWc from "@/components/ListaWc";

// Firebase
import { db } from "@/constants/firebaseConfig";
import { ref, push, get, onValue, update } from "firebase/database";

const NODE_MAIN = "wcsUnisystem";

export default function WcList() {
  const [task, setTask] = useState("");
  const [tasks, setTasks] = useState<{ id: string; ocupado: boolean }[]>([]);
  const [loading, setLoading] = useState(false);

  // Função para adicionar uma nova sala
  const addTask = async () => {
    if (task.trim()) {
      try {
        const taskRef = ref(db, `${NODE_MAIN}/${task}`);
        await update(taskRef, { id: task, ocupado: false });
        setTask(""); // Limpa o campo
      } catch (error) {
        Alert.alert("Erro", "Não foi possível adicionar a sala.");
        console.error(error);
      }
    }
  };

  // Observa as mudanças no banco de dados
  useEffect(() => {
    const tasksRef = ref(db, NODE_MAIN);
    const unsubscribe = onValue(tasksRef, (snapshot) => {
      const data = snapshot.val();
      const loadedTasks = data
        ? Object.keys(data).map((key) => ({
            id: key,
            ocupado: data[key].ocupado,
          }))
        : [];
      setTasks(loadedTasks);
    });

    return () => unsubscribe();
  }, []);

  // Função para obter o valor de uma sala específica
  const getSpecificTask = async (taskId: string) => {
    try {
      const taskRef = ref(db, `${NODE_MAIN}/${taskId}`);
      const snapshot = await get(taskRef);

      if (snapshot.exists()) {
        const taskData = snapshot.val();
        Alert.alert("Sala Obtida", `ID: ${taskData.id}`);
      } else {
        Alert.alert("Erro", "Sala não encontrada.");
      }
    } catch (error) {
      Alert.alert("Erro", "Não foi possível obter a sala.");
      console.error(error);
    }
  };

  // Atualiza o status de uma sala
  const updateSpecificTask = async (updatedItem: { id: string; ocupado: boolean }) => {
    try {
      setLoading(true);
      const taskRef = ref(db, `${NODE_MAIN}/${updatedItem.id}`);
      await update(taskRef, { ocupado: updatedItem.ocupado });

      // Atualiza o estado local para refletir as mudanças
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.id === updatedItem.id ? { ...task, ocupado: updatedItem.ocupado } : task
        )
      );
    } catch (error) {
      Alert.alert("Erro", "Não foi possível atualizar a sala.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Lista de WCs Unisystem</Text>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Digite o nr. da Sala"
          value={task}
          onChangeText={setTask}
        />
        <Button title="Adicionar" onPress={addTask} />
      </View>

      {loading && <Text>Carregando...</Text>}

      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ListaWc item={item} handleUpdated={updateSpecificTask} />
        )}
      />
    </View>
  );
}
