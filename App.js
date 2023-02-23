import {
  FlatList,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  View,
} from "react-native";
import NotaEditor from "./src/componentes/NotaEditor";
import { Nota } from "./src/componentes/Nota";
import { useEffect, useState } from "react";
import { buscaNotas, criaTabela } from "./src/services/Notas";
import { Picker } from "@react-native-picker/picker";
import { filtraCategoria } from "./src/services/Notas";

export default function App() {
  useEffect(() => {
    criaTabela();
    mostraNotas();
  }, []);

  const [notaSelecionada, setNotaSelecionada] = useState({});
  const [categoria, setCategoria] = useState("Todos");
  const [notas, setNotas] = useState([]);
  async function mostraNotas() {
    const todasNotas = await buscaNotas();
    setNotas(todasNotas);
  }

  async function filtraNotas(categoria) {
    setCategoria(categoria)
    if (categoria == "Todos") {
      mostraNotas();
    } else {
      setNotas(await filtraCategoria(categoria));
    }
  }

  //Ajeitar depois com Picker no ListHeaderComponent

  return (
    <SafeAreaView style={estilos.container}>
      <Picker
        selectedValue={categoria}
        onValueChange={(novaCategoria) => filtraNotas(novaCategoria)}
      >
        <Picker.Item label="Todos" value="Todos" />
        <Picker.Item label="Pessoal" value="Pessoal" />
        <Picker.Item label="Trabalho" value="Trabalho" />
        <Picker.Item label="Outros" value="Outros" />
      </Picker>
      <FlatList
        data={notas}
        renderItem={(nota) => (
          <Nota {...nota} setNotaSelecionada={setNotaSelecionada} />
        )}
        keyExtractor={(nota) => nota.id}
      />
      <NotaEditor
        mostraNotas={mostraNotas}
        notaSelecionada={notaSelecionada}
        setNotaSelecionada={setNotaSelecionada}
      />
      <StatusBar />
    </SafeAreaView>
  );
}

const estilos = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "stretch",
    justifyContent: "flex-start",
  },
});
