import React, {useState, useEffect} from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import UserProfile from '../../components/userProfile/userProfile';
import UserCard from '../../components/userCard/userCard';
import { ActivityIndicator } from 'react-native-paper';
import { RootStackParamList } from '../../navigation/NavigationModule';
import { StackNavigationProp } from '@react-navigation/stack'
import { RouteProp } from '@react-navigation/native';
import api from '../../services/api'

type profileScreenNavigationProp = StackNavigationProp<RootStackParamList, 'ProfileScreen'>;
//Propriedades de navegação
type profileScreenRouteProp = RouteProp<RootStackParamList, 'ProfileScreen'>;
//Propriedades de rota (Receber os parâmetros de navegação)

interface ProfileScreen { 
    navigation: profileScreenNavigationProp,
    route: profileScreenRouteProp
}

type licenseObject = {
    name: string,
}

type reposObject = {
    id: number,
    name: string,
    description: string,
    language: string,
    updated_at: string,
    stargazers_count: number,
    fork: boolean,
    license: licenseObject
}

type profileObject = {
    avatar_url: string,
    login: string,
    bio: string,
    followers: number,
    following: number,
    public_repos: number
}


const ProfileScreen: React.FC<ProfileScreen> = ({
    navigation,
    route
}) => {

    const [data, setData] = useState<Array<reposObject>>([]);
    const [dataProfile, setDataProfile] = useState<profileObject | any>({}); 
    // Nesse caso eu preciso usar o 'any' para poder forçar uma inicialização
    const [isLoading, setLoading] = useState<Boolean>(false);

    useEffect(() => {
        setLoading(true);
            api.get(`users/${route.params.user}/repos`)
                .then((response) => setData(response.data))
                .catch((error) => console.error(error))
            api.get(`users/${route.params.user}`)
                .then((response ) => setDataProfile(response.data))
                .catch((error) => console.error(error))
        .finally(() => setLoading(false));
    },[])

    return(
        <View style={styles.container}>
            {isLoading === true  ? 
                <ActivityIndicator style={styles.activity_indicator} color={'#000'}/> : 
                <FlatList
                    data={data}
                    keyExtractor={(item) => item.id.toString()}
                    ListHeaderComponent={() => 
                        <UserProfile
                            avatar_url={dataProfile.avatar_url}
                            login={dataProfile.login}
                            bio={dataProfile.bio}
                            followers={dataProfile.followers}
                            following={dataProfile.following}
                            public_repos={dataProfile.public_repos}
                        />
                    }
                    renderItem={({item}) => 
                        <UserCard
                            name={item.name}
                            description={item.description}
                            language={item.language}
                            updated_at={item.updated_at}
                            stargazers_count={item.stargazers_count}
                            fork={item.fork}
                            license={item.license}
                        />
                    }
                />
            }
        </View>
    );
}

const styles = StyleSheet.create({
    container:{
        flex: 1,
        backgroundColor: "#DDDD",
    },
    activity_indicator: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    }
})

export default ProfileScreen;
