import React, { Component } from 'react';
import api from '../../services/api';
import { Link } from 'react-router-dom';

export default class covidTable extends Component {
    //state's que guardarão os dados do vindos do webservice...    
    state = { _ufData: [], }
    state = { _cytyData: [], }
    state = { _listData: [], }

    //onShow
    async componentDidMount() {
        await this.getlistAll();
    }

    //Faz a carga dos dados
    async getlistAll() {
        await this.gethash_UF();
        await this.gethash_cyty();
        await this.getdata_list();
    }

    //pega o primeiro hash 
    async gethash_UF() {
        const response = await api.get('/recrutamentoagely/covid?service=uf&filter=mg');
        this.setState({ _ufData: response.data });
        console.log(this.state._ufData);
    }
    //pega o segundo hash
    async gethash_cyty() {
        const response = await api.get('/recrutamentoagely/covid?service=cidade&filter=passos&hash=' + this.state._ufData.hash);
        this.setState({ _cytyData: response.data });
        console.log(this.state._cytyData);
    }
    //pega a listagem dos dados...
    async getdata_list() {
        api.get('/recrutamentoagely/covid?service=dados&hash=' + this.state._cytyData.hash)
            .then(res => {
                this.setState({ _listData: res.data.dados });
                this.setState({ _hashAtual: this.state._cytyData.hash });
                console.log(this.state._listData);

                //depois de receber a lista, faz as estatisticas;
                this.setStatistics();
            });
    }

    //estatisticas
    setStatistics() {
        let sumIdadeTestPositive = 0; let countTestPositive = 0;
        let sumIdadeTestNegative = 0; let countTestNegative = 0;

        let dados = this.state._listData;
        let isPositive = false;
        let idade = 0;
        //calcula media de idade de teveCovid = true e teveCovid = false
        for (let i = 0; i <= dados.length; i++) {
            try {
                isPositive = dados[i].teveCovid;
            } catch (error) {
                isPositive = false;
            }

            try {
                idade = dados[i].idade;
            } catch (error) {
            }

            if (isPositive) {
                sumIdadeTestPositive += idade;
                countTestPositive += 1;
            } else {
                sumIdadeTestNegative += idade;
                countTestNegative += 1;
            }
        }
        this.setState({ mediaIdadePessoasCovidSim: (sumIdadeTestPositive / countTestPositive).toFixed() })
        this.setState({ mediaIdadePessoasCovidNao: (sumIdadeTestNegative / countTestNegative).toFixed() })

        //
        //idade pessoa mais jovem q tomou as 3 doses        
        let idadeNow = 0;
        //por enquanto a menor idade é a do index[0] mesmo....
        let idadeMinus = dados[0].idade;
        let doses = 0;
        for (let i = 0; i <= dados.length; i++) {
            try {
                idadeNow = dados[i].idade;
            } catch (error) {
            }
            try {
                doses = dados[i].doses;
            } catch (error) {
            }
            //console.log(`Idade do elmento ${i} é: ${idadeNow} qtde doses ${doses}`);
            if (doses === 3) {
                if (idadeNow < idadeMinus) {
                    idadeMinus = idadeNow;
                }
                //console.log(`Menor Idade por enquanto: ${idadeMinus}`);
            }

        }
        //console.log('menor idade apurada ' + idadeMinus);
        this.setState({ IdadePessoaMaisJovemDose3: idadeMinus })

        //pessoa mais velha q tomou as 3 doses (so inverter a logica)               
        doses = 0;
        idadeNow = 0;
        idadeMinus = dados[0].idade;
        for (let i = 0; i <= dados.length; i++) {
            try {
                idadeNow = dados[i].idade;
            } catch (error) {
            }
            try {
                doses = dados[i].doses;
            } catch (error) {
            }

            if (doses === 3) {
                if (idadeNow > idadeMinus) {
                    idadeMinus = idadeNow;
                }
            }

        }
        console.log('maior idade apurada ' + idadeMinus);
        this.setState({ IdadePessoaMaisVelhaDose3: idadeMinus })

        //porcentagem de pessoas teveCovid=true e dose=0 
        countTestPositive = 0;
        doses = 0;
        isPositive = false;
        for (let i = 0; i <= dados.length; i++) {
            try {
                isPositive = dados[i].teveCovid;
            } catch (error) {
            }
            try {
                doses = dados[i].doses;
            } catch (error) {
            }
            //console.log('..dose do elemento ' + i + '=' + doses + ' | teve o mardito? ' + isPositive);
            if ((doses === 0) && (isPositive)) {
                countTestPositive = countTestPositive + 1;
                console.log('somou 1...');
            }
            //console.log('Teve covid e dose 0 ' + countTestPositive);

        }

        this.setState({ PessoasTestadasPosDose0: ((countTestPositive / dados.length) * 100).toFixed(2) })

        //porcentagem de pessoas que teveCovid=true e dose=3 
        countTestPositive = 0;
        doses = 0;
        for (let i = 0; i <= dados.length; i++) {
            try {
                isPositive = dados[i].teveCovid;
            } catch (error) {
            }
            try {
                doses = dados[i].doses;
            } catch (error) {
            }

            if ((doses === 3) && (isPositive)) {
                countTestPositive++;
            }

        }
        this.setState({ PessoasTestadasPosDose3: ((countTestPositive / dados.length) * 100).toFixed(2) });

        //media das doses 
        let sumDoses = 0;
        doses = 0;
        for (let i = 0; i <= dados.length; i++) {
            try {
                doses = dados[i].doses;
            } catch (error) {
            }

            sumDoses += doses;

        }

        this.setState({ MediaDosePessoas: (sumDoses / dados.length).toFixed(2) })
    }

    render() {

        return (

            <div className='col-sm-12'>
                <br></br>
                <h3>Lista de Vacinados ( Total: {this.state._listData.length} )</h3>

                <br></br>
                <br></br>
                <table className="display" width="100%">
                    <thead>
                        <tr>
                            <th>NOME</th>
                            <th>IDADE</th>
                            <th>DOSES</th>
                            <th>TEVE COVID</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.state._listData.map(_listData => (
                            <tr key={_listData.i}>
                                <td>{_listData.nome}</td>
                                <td>{_listData.idade}</td>
                                <td>{_listData.doses}</td>
                                <td>{_listData.teveCovid ? 'Sim' : 'Não'}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <div>
                    <br></br>
                    <h3>Estatisticas</h3>
                    <h4>Media de idade das pessoas que tiveram covid:{this.state.mediaIdadePessoasCovidSim}</h4>
                    <h4>Media de idade das pessoas que não tiveram covid:{this.state.mediaIdadePessoasCovidNao}</h4>
                    <h4>Idade da pessoa mais jovem que tomou as 3 doses da vacina:{this.state.IdadePessoaMaisJovemDose3}</h4>
                    <h4>Idade da pessoa mais velha que tomou as 3 doses da vacina:{this.state.IdadePessoaMaisVelhaDose3}</h4>
                    <h4>Porcentagem de pessoas que tiveram covid sem tomar nenhuma dose da vacina:{this.state.PessoasTestadasPosDose0} %</h4>
                    <h4>Porcentagem de pessoas que tiveram covid tomando as 3 doses da vacina:{this.state.PessoasTestadasPosDose3} %</h4>
                    <h4>Media de doses por pessoas:{this.state.MediaDosePessoas}</h4>
                </div>
            </div>
        )
    }
}
