import { Lesson } from "@/types/lesson";

export const practiceTimeLesson: Lesson = {
    id: "practice-time",
    type: "vowel",
    title: "Practice Time",
    description: "All vowel quizzes and games in one place.",
    steps: [
        {
            id: "practice-intro",
            type: "intro",
            prompt: "Practice Time"
        },
        {
            id: "practice-explain",
            type: "explanation",
            data: {
                heading: "Practice Time",
                text: "This module contains the quizzes, reverse game, tracing, true/false challenge, and rewards for the vowel sequence.",
                devnagari: "अः",
                brahmi: "𑀅𑀂"
            }
        },
        {
            id: "practice-quiz",
            type: "quiz",
            data: {
                title: "Quiz and Game Practice"
            }
        },
        {
            id: "practice-reward",
            type: "reward"
        }
    ],
    reward: {
        points: 0,
        badge: "Practice Time"
    }
};
