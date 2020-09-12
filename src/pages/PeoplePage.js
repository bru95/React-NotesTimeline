import React from 'react';
import { Text, ScrollView, StyleSheet } from 'react-native';
import PeopleList from '../components/PeopleList';
import firebase from 'firebase';
import { FloatingAction } from 'react-native-floating-action';
import { SafeAreaView } from 'react-navigation';

export default class PeoplePage extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            people: []
        }
    }

    componentDidMount() {
        var db = firebase.database();
        db.ref('/usr/people').on('value', querySnapShot => {
            let data = [];
            querySnapShot.forEach((child) => {
                data.push({
                    id: child.val().id,
                    nome: child.val().nome
                })
            })
            console.log(data)
            this.setState({
                people: data
            });
        })
    }

    addPerson() {
        var db = firebase.database();
        db.ref('/usr/people').push({ nome: 'Alguém' })
            .then(() => { console.log('Inserido com sucesso') })
            .catch(() => { console.log('Erro ao inserir registro') })
    }

    render() {
        const actions = [
            {
                text: 'Nova Pessoa',
                icon: require("../img/icons/add-person.png"),
                name: 'btnNovaPessoa',
                position: 2
            }
        ]

        return (
            <SafeAreaView style={styles.container}>
                <ScrollView>
                    <PeopleList people={this.state.people} />
                </ScrollView>

                <FloatingAction actions={actions} onPressItem={() => this.addPerson()} />

            </SafeAreaView>
        )
    };
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff'
    }
})
