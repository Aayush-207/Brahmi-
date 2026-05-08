import ancientEchoes from '@/content/courses/ancient-echoes.json';
import { COURSE_MODULES } from './courseData';

export function getNextLessonId(currentLessonId: string): string | null {
    // Flatten all lessons from modules
    const allLessons = ancientEchoes.modules.flatMap(module => module.lessons);

    const currentIndex = allLessons.findIndex(l => l.lessonId === currentLessonId);

    if (currentIndex !== -1 && currentIndex < allLessons.length - 1) {
        return allLessons[currentIndex + 1].lessonId;
    }

    return null;
}

/**
 * Get the next module route based on current module
 * Used to automatically continue to next module after module completion
 */
export function getNextModuleRoute(currentModuleId: string): string | null {
    const currentIndex = COURSE_MODULES.findIndex(m => m.id === currentModuleId);

    if (currentIndex !== -1 && currentIndex < COURSE_MODULES.length - 1) {
        return COURSE_MODULES[currentIndex + 1].route;
    }

    return null; // No more modules
}
