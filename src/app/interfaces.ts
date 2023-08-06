export interface Question {
    content: string;
}

export interface Answer {
    content: string;
    chart : object;
}

export interface Messages {
    answer: string;
    question : string;
}

export interface Chat {
    id? :number
    name: string;
    description: string;
    database: string;
    pinecone : string;
    pineconeDimension? : number;
    chunkSize? : number;
}

export interface Message{
    content : string
    user : string
    chatId :number
    insight? : string
    chart? : any
}

export interface Information{
    pinecone: string
    database : string
    description : string
}

