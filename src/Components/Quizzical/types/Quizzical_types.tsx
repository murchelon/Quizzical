export type tpAnswer = {
    index: number,
    answerText: string,
    correctAnswer: boolean,
    selectedAnswer: boolean
}

export type tpQuestion = {
    id: string,
    index: number,
    category: string,
    difficulty: string,
    questionText: string,
    answers: Array<tpAnswer>
};