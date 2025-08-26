export declare enum Sexo {
    Masculino = "Masculino",
    Feminino = "Feminino",
    Outro = "Outro"
}
export declare enum Status {
    Ativo = "Ativo",
    Inativo = "Inativo"
}
export declare class Paciente {
    id: string;
    nome: string;
    email: string;
    data_nascimento: Date;
    telefone: string;
    endereco: string;
    documento_cpf: string;
    sexo: Sexo;
    data_cadastro: Date;
    data_atualizacao: Date;
    status: Status;
    constructor(props: {
        nome: string;
        email: string;
        data_nascimento: Date;
        telefone: string;
        endereco: string;
        documento_cpf: string;
        sexo: Sexo;
    }, id?: string);
}
