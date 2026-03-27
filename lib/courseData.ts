export type CourseModule = {
    id: string
    title: string
    subtitle: string
    route: string
    icon: string
    iconType: 'text' | 'emoji' // Helper to style emoji vs text differently if needed
    order: number
    locked?: boolean // If true, module is not yet available
}

export const COURSE_MODULES: CourseModule[] = [
    {
        id: 'module-intro',
        title: 'Introduction',
        subtitle: 'History of Brahmi',
        route: '/learn/intro',
        icon: '📜',
        iconType: 'emoji',
        order: 1,
        locked: false
    },
    {
        id: 'module-swar',
        title: 'Swar (Vowels)',
        subtitle: 'The Soul of Script',
        route: '/letters', // Connected to existing vowels page
        icon: 'अ',
        iconType: 'text',
        order: 2
    },
    {
        id: 'module-vyanjan',
        title: 'Vyanjan (Consonants)',
        subtitle: 'The Body of Script',
        route: '/learn/vyanjan',
        icon: 'क',
        iconType: 'text',
        order: 3,
        locked: false
    },
    {
        id: 'module-matra',
        title: 'Mātrā (Matras)',
        subtitle: 'The Art of Vowel Diacritics',
        route: '/learn/matra',
        icon: 'का',
        iconType: 'text',
        order: 4,
        locked: false
    }
]
