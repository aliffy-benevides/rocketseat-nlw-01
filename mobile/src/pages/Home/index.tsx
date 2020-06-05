import React, { useState, useEffect } from 'react';
import { StyleSheet, View, ImageBackground, Image, Text, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Feather as Icon } from '@expo/vector-icons'
import { RectButton } from 'react-native-gesture-handler';
import Select from 'react-native-picker-select';

import axios from 'axios';

interface IBGEUFResponse {
    sigla: string;
}

interface IBGECityResponse {
    nome: string;
}

const Home = () => {
    const [ufs, setUfs] = useState<string[]>([]);
    const [cities, setCities] = useState<string[]>([]);

    const [selectedUf, setSelectedUf] = useState('0');
    const [selectedCity, setSelectedCity] = useState('0');
    const navigation = useNavigation();

    // Get UFs
    useEffect(() => {
        axios.get<IBGEUFResponse[]>("https://servicodados.ibge.gov.br/api/v1/localidades/estados")
            .then(resp => {
                const ufInitials = resp.data.map(uf => uf.sigla);
                setUfs(ufInitials);
            })
    }, [])

    // Get Cities
    useEffect(() => {
        if (selectedUf === '0') {
            setCities([]);
            return;
        }

        axios.get<IBGECityResponse[]>(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedUf}/municipios`)
            .then(resp => {
                const cityNames = resp.data.map(uf => uf.nome);
                setCities(cityNames);
            })
    }, [selectedUf])

    function handleNavigateToPoints() {
        navigation.navigate('Points', {
            uf: selectedUf,
            city: selectedCity
        });
    }

    return (
        <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS == 'ios' ? 'padding' : undefined}>
            <ImageBackground
                source={require('../../assets/home-background.png')}
                style={styles.container}
                imageStyle={{ width: 274, height: 368 }}
            >
                <View style={styles.main}>
                    <Image source={require('../../assets/logo.png')} />
                    <View>
                        <Text style={styles.title}>
                            Seu marketplace de coleta de resíduos
                        </Text>
                        <Text style={styles.description}>
                            Ajudamos pessoas a encontrarem pontos de coleta de forma eficiente
                        </Text>
                    </View>
                </View>

                <View style={styles.footer}>
                    {/* <TextInput style={styles.input} placeholder="Digite a UF"
                        maxLength={2}
                        autoCapitalize="characters"
                        autoCorrect={false}
                        value={uf}
                        onChangeText={setUf} />
                    <TextInput style={styles.input} placeholder="Digite a Cidade"
                        value={city}
                        autoCorrect={false}
                        onChangeText={setCity} /> */}
                    <Select 
                        placeholder={{ label: 'Selecione uma UF', value: '0' }}
                        onValueChange={value => setSelectedUf(value)}
                        items={ufs.map(uf => ({ label: uf, value: uf }))}
                    />
                    <Select
                        placeholder={{ label: 'Selecione uma Cidade', value: '0' }}
                        onValueChange={value => setSelectedCity(value)}
                        items={cities.map(city => ({ label: city, value: city }))}
                    />

                    <RectButton style={styles.button} onPress={handleNavigateToPoints}>
                        <View style={styles.buttonIcon}>
                            <Icon name="arrow-right" color="#FFF" size={24} />
                        </View>
                        <Text style={styles.buttonText}>
                            Entrar
                        </Text>
                    </RectButton>
                </View>
            </ImageBackground>
        </KeyboardAvoidingView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 32
    },

    main: {
        flex: 1,
        justifyContent: 'center',
    },

    title: {
        color: '#322153',
        fontSize: 32,
        fontFamily: 'Ubuntu_700Bold',
        maxWidth: 260,
        marginTop: 64,
    },

    description: {
        color: '#6C6C80',
        fontSize: 16,
        marginTop: 16,
        fontFamily: 'Roboto_400Regular',
        maxWidth: 260,
        lineHeight: 24,
    },

    footer: {},

    select: {},

    input: {
        height: 60,
        backgroundColor: '#FFF',
        borderRadius: 10,
        marginBottom: 8,
        paddingHorizontal: 24,
        fontSize: 16,
    },

    button: {
        backgroundColor: '#34CB79',
        height: 60,
        flexDirection: 'row',
        borderRadius: 10,
        overflow: 'hidden',
        alignItems: 'center',
        marginTop: 8,
    },

    buttonIcon: {
        height: 60,
        width: 60,
        backgroundColor: 'rgba(0, 0, 0, 0.1)',
        justifyContent: 'center',
        alignItems: 'center'
    },

    buttonText: {
        flex: 1,
        justifyContent: 'center',
        textAlign: 'center',
        color: '#FFF',
        fontFamily: 'Roboto_500Medium',
        fontSize: 16,
    }
});

export default Home;
