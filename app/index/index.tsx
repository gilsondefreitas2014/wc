//React
import React, { useState, useEffect } from 'react';
import { Alert, Text } from 'react-native';

//Estilos
import { styles } from './styles';
//import EditScreenInfo from '@/components/EditScreenInfo';
import { View, TextInput, Button, FlatList } from '@/components/Themed';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

//Firebase
import { db } from '@/constants/firebaseConfig';
import {ref, push, get, onValue, update, remove} from "firebase/database"

const nodeMain: string = "wcsUnisystem";
let tasksRef;

export default function index() {
  
  const [task, setTask] = useState("");
  const [tasks, setTasks] = useState<{ id: string; ocupado: string; }[]>([]);
  const [specificTask, setSpecificTask] = useState("");

  // Função para adicionar uma nova tarefa
  const addTask = () => {

    if (task.trim()) {      
      //tasksRef = ref(db, nodeMain);
      //push(tasksRef, { text: task });// Adiciona um novo nó para a nova tarefa);
      //setTask(""); // Limpa o campo de entrada

      tasksRef = ref(db, `${nodeMain}/${task}`); 
      update(tasksRef, { id : task, ocupado: false});
      setTask("");
    }
  };

   // Observa as mudanças no banco de dados neste nó
   useEffect(() => {
    tasksRef = ref(db, nodeMain);
    const unsubscribe = onValue(tasksRef, (snapshot) => {
      const data = snapshot.val();
      const loadedTasks: { id: string; ocupado: string; }[] = data
        ? Object.keys(data).map((key) => ({ id: key, ocupado: data[key].ocupado }))
        : [];
      setTasks(loadedTasks);
    });

    return () => unsubscribe();
  }, []);

  // Função para obter o valor de um tópico específico
  const getSpecificTask = async (taskId: string) => {
    try {
      let taskRef = ref(db, `${nodeMain}/${taskId}`);
      const snapshot = await get(taskRef);

      if (snapshot.exists()) {
        const taskData = snapshot.val();
        setSpecificTask(taskData.id); // Exibe o valor no estado
        Alert.alert("Sala Obtida", `Texto: ${taskData.id}`);
      } else {
         Alert.alert("Erro", "Sala não encontrada.");
      }
    } catch (error) {
      Alert.alert("Erro", "Não foi possível obter a WC.");
      console.error(error);
    }
  };

  const updateSpecificTask = async (taskId: string) => {
    try {
      tasksRef = ref(db, `${nodeMain}/${taskId}`); 
      update(tasksRef, { id : taskId, ocupado: true});
    } catch (error) {
      Alert.alert("Erro", "Não foi possível reservar o WC.");
      console.error(error);
    }  
  };

  return (
    <View style={styles.container}>
      {/* <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" /> */}
      {/* <EditScreenInfo path="app/index/index.tsx" /> */}

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

      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.taskContainer}>
            {item.ocupado ? <MaterialIcons name="wc" size={48} color="red" /> : <MaterialIcons name="wc" size={48} color="green" />}

            <Text style={styles.task}>
              {item.id}
            </Text>

             <Text style={styles.task}>
                {item.ocupado ? 'Ocupado' : 'Livre'}
             </Text>

             
            
            {/* <Button title="Detalhes" onPress={() => getSpecificTask(item.id)} /> */}
            <Button title="Reservar" onPress={() => updateSpecificTask(item.id)} />
          </View>
        )}
      />

      {/* {specificTask ? <Text style={styles.specificTask}>WC Selecionado: {specificTask}</Text> : null} */}
    </View>
  );
}
