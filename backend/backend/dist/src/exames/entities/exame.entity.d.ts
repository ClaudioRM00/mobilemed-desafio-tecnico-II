export declare enum Modalidade {
    CR = "CR",
    CT = "CT",
    DX = "DX",
    MG = "MG",
    MR = "MR",
    NM = "NM",
    OT = "OT",
    PT = "PT",
    RF = "RF",
    US = "US",
    XA = "XA"
}
export declare class Exame {
    id: string;
    nome_exame: string;
    modalidade: Modalidade;
    id_paciente: string;
    data_exame: Date;
    idempotencyKey: string;
    data_cadastro: Date;
    data_atualizacao: Date;
    constructor(props?: {
        nome_exame: string;
        modalidade: Modalidade;
        id_paciente: string;
        data_exame?: Date;
        idempotencyKey: string;
    }, id?: string);
}
