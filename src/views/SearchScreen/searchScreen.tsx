import React, { useState } from 'react';
import { View, StyleSheet, FlatList} from 'react-native';
import SearchBar from '../../components/searchBar/searchBar';
import UserIcon from '../../components/userIcon/userIcon';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../navigation/NavigationModule';
import api from '../../services/api'

type SearchScreenNavigationProp = StackNavigationProp<RootStackParamList, 'SearchScreen'>;
//Parâmetros de navegação da tela
//Meu objetivo é passar a navegação da tela para o componente


interface SearchScreenProps {
    navigation: SearchScreenNavigationProp,
 }

const SearchScreen: React.FC<SearchScreenProps> = ({
    navigation,
}) => {
    interface dataTypes {
        id: number,
        login: string,
        avatar_url: string,
        type: string, 
    }


    const [userName, setUserName] = useState<string>("");
    const [data, setData] = useState<dataTypes | any>([]);
    const [isLoading, setLoading] = useState<boolean>(false);

    const getAPIGithub = (user: string) => {
        setLoading(true);
            api.get(`search/users?q=${user}`)
            .then((response) => setData(response.data.items))
            .catch((error) => console.error(error))
        .finally(() => setLoading(false));
    }

    return(
        <View style={styles.container}>
            <SearchBar userName={userName} setUserName={setUserName} getAPIGithub={getAPIGithub} loading={isLoading}/>

            <FlatList
                data={data}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({item}) => 
                    <UserIcon
                        avatar_url={item.avatar_url}
                        login={item.login}
                        type={item.type} 
                        navigation={navigation}
                    />
                }
            />
        </View>
    );
}


const styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: "#E3E3E3",
        paddingTop: 15,
    },
});

export default SearchScreen;


// Informações importantes:

/**
 * 1- É importante seguir esse modelo de requisição e navegação para que o projeto possa ser construido de uma maneira mais
 * profissional.
 *  - Não preciso necessáriamente utiliza-los, mas é recomendável.
 *  
 * >> Ficar tranquilo, pois só vou ter mais segurança conforme eu for utilizando as propriedades, assim como os modelos de organização.
 *  - O mais importante é aprender e praticar, a sintaxe e organização vai variar de acordo com o ambiente, então ficar tranquilo.
 */