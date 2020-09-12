import React from 'react';
import { Button, StyleSheet, View, Image, KeyboardAvoidingView, Platform, ActivityIndicator, Alert, AsyncStorage } from 'react-native';
import { ScrollView, TextInput } from 'react-native-gesture-handler';
import FormRow from '../components/FormRow';
import firebase from 'firebase';

export default class LoginPage extends React.Component {

    constructor(props) {
        super(props),

            this.state = {
                email: "",
                password: "",
                isLoading: false,
                message: ''
            }
    }

    componentDidMount() {
        AsyncStorage.getItem('NT::userData').then((user_data_json) => {
            let user_data = JSON.parse(user_data_json)
            if (user_data != null)
                this.access(user_data)
        })

        var firebaseConfig = {
            apiKey: "AIzaSyDNsnxddCADrFIIROf0ngmPTbcPOUlBU5I",
            authDomain: "notestimeline-bruna.firebaseapp.com",
            databaseURL: "https://notestimeline-bruna.firebaseio.com",
            projectId: "notestimeline-bruna",
            storageBucket: "notestimeline-bruna.appspot.com",
            messagingSenderId: "715472429997",
            appId: "1:715472429997:web:0e559e7d2dccd1bf4b3724",
            measurementId: "G-V9RD2WWLHP"
        };
        // Initialize Firebase
        firebase.initializeApp(firebaseConfig);
        //firebase.analytics();
    }

    onChangeHandler(field, value) {
        this.setState({ [field]: value })
    }
    access(userData) {
        this.setState({ isLoading: false });
        AsyncStorage.setItem('NT::userData', JSON.stringify(userData));
        this.props.navigation.replace('People');
    }

    login() {
        this.setState({ isLoading: true, message: '' });
        const { email, password } = this.state;

        return firebase
            .auth()
            .signInWithEmailAndPassword(email, password)
            .then(user => {
                this.access(user);
            })
            .catch(error => {
                this.setState({
                    message: this.getMsgByErrorCode(error.code),
                    isLoading: false
                })
            });
    }

    getMsgByErrorCode(errorCode) {
        switch (errorCode) {
            case "auth/wrong-password":
                return "Senha incorreta";
            case "auth/invalid-email":
                return "E-mail invalido";
            case "auth/user-not-found":
                return "Usuário não encontrado";
            case "auth/user-disabled":
                return "Usuário desativado";
            case "auth/email-already-in-use":
                return "Usuário já esta em uso";
            case "auth/operation-not-allowed":
                return "Operação não permitida";
            case "auth/weak-password":
                return "Senha muito fraca";
            default:
                return "Erro desconhecido";
        }
    }

    getRegister() {
        const { email, password } = this.state;
        if (!email || !password) {
            Alert.alert(
                "Cadastro!",
                "Para se cadastrar informe e-mail e senha!"
            )
            return null
        }
        Alert.alert(
            "Cadastro!",
            "Deseja cadastrar seu usuário com os dados informados?",
            [
                {
                    text: "Cancelar",
                    style: "cancel"
                },
                {
                    text: "Cadastrar",
                    onPress: () => { this.register() }
                }
            ]
        )
    }

    register() {
        const { email, password } = this.state;

        return firebase
            .auth()
            .createUserWithEmailAndPassword(email, password)
            .then(user => {
                this.access(user);
            })
            .catch(error => {
                this.setState({
                    message: this.getMsgByErrorCode(error.code),
                    isLoading: false
                })
            })
    }

    renderButton() {
        if (this.state.isLoading)
            return <ActivityIndicator size="large" style={styles.loading} />

        return (
            <View>
                <View style={styles.btn}>
                    <Button
                        title="ENTRAR"
                        color="#6542f4"
                        onPress={() => this.login()}
                    />
                </View>
                <View style={styles.btn}>
                    <Button
                        title="REGISTRE-SE"
                        color="#a08af7"
                        onPress={() => this.getRegister()}
                    />
                </View>
            </View>
        )
    }

    renderMessage() {
        const { message } = this.state;
        if (!message)
            return null;

        Alert.alert(
            "Erro!",
            message.toString(),
            [{
                text: 'OK',
                onPress: () => { this.setState({ message: '' }) }
            }]
        )
    }

    render() {
        return (
            <KeyboardAvoidingView behavior={Platform.OS == "ios" ? "padding" : "height"} style={{ flex: 1 }}>
                <ScrollView style={styles.container}>
                    <View style={styles.logoView} >
                        <Image source={require('../img/logo.png')} style={styles.logo} />
                    </View>
                    <FormRow>
                        <TextInput style={styles.input} placeholder="user@email.com" keyboardType="email-address" value={this.state.email} onChangeText={value => this.onChangeHandler('email', value)}></TextInput>
                    </FormRow>
                    <FormRow>
                        <TextInput style={styles.input} placeholder="******" secureTextEntry value={this.state.password} onChangeText={value => this.onChangeHandler('password', value)}></TextInput>
                    </FormRow>
                    {this.renderButton()}
                    {this.renderMessage()}
                </ScrollView>
            </KeyboardAvoidingView>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#dbd5d5"
    },
    input: {
        paddingRight: 5,
        paddingLeft: 5
    },
    btn: {
        paddingTop: 20,
        fontSize: 11
    },
    logo: {
        aspectRatio: 1,
        resizeMode: 'center',
        width: 400,
        height: 400
    },
    logoView: {
        justifyContent: 'center',
        alignItems: 'center'
    },
    loading: {
        padding: 20,
    }
});