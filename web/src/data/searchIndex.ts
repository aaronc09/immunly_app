import { MODULES, MODULE_COLORS, type Section } from './curriculum';

export interface SearchResult {
  moduleId: string;
  moduleTitle: string;
  moduleColor: string;
  lessonId: string;
  lessonTitle: string;
  snippet: string;
  matchedTitle: boolean;
}

interface IndexedLesson {
  moduleId: string;
  moduleTitle: string;
  lessonId: string;
  lessonTitle: string;
  text: string;
}

function sectionText(section: Section): string {
  switch (section.type) {
    case 'text':
      return [section.heading, section.body].filter(Boolean).join(' ');
    case 'callout':
      return [section.label, section.text].filter(Boolean).join(' ');
    case 'table':
      return [section.heading, ...section.rows.flatMap(r => [r.left, r.right])].filter(Boolean).join(' ');
    case 'steps':
      return [section.heading, ...section.steps.flatMap(s => [s.label, s.detail])].filter(Boolean).join(' ');
    case 'terms':
      return [section.heading, ...section.terms.flatMap(t => [t.term, t.definition])].filter(Boolean).join(' ');
    default:
      return '';
  }
}

// Built once at module load — the curriculum is static, so there's no need
// to rebuild this index on every search.
const INDEX: IndexedLesson[] = MODULES.flatMap(mod =>
  mod.lessons.map(lesson => ({
    moduleId: mod.id,
    moduleTitle: mod.title,
    lessonId: lesson.id,
    lessonTitle: lesson.title,
    text: [lesson.title, ...lesson.sections.map(sectionText), ...lesson.takeaways].join(' · '),
  }))
);

function makeSnippet(text: string, query: string, contextLength = 50): string {
  const idx = text.toLowerCase().indexOf(query.toLowerCase());
  if (idx === -1) return text.slice(0, contextLength * 2).trim() + '…';
  const start = Math.max(0, idx - contextLength);
  const end = Math.min(text.length, idx + query.length + contextLength);
  return (start > 0 ? '…' : '') + text.slice(start, end).trim() + (end < text.length ? '…' : '');
}

export function searchLessons(rawQuery: string, limit = 8): SearchResult[] {
  const query = rawQuery.trim();
  if (query.length < 2) return [];
  const lowerQuery = query.toLowerCase();

  return INDEX
    .map(item => {
      const titleMatch = item.lessonTitle.toLowerCase().includes(lowerQuery);
      const moduleMatch = item.moduleTitle.toLowerCase().includes(lowerQuery);
      const bodyMatch = item.text.toLowerCase().includes(lowerQuery);
      if (!titleMatch && !moduleMatch && !bodyMatch) return null;

      const rank = titleMatch ? 0 : moduleMatch ? 1 : 2;
      const snippet = titleMatch
        ? item.lessonTitle
        : makeSnippet(item.text, query);

      return {
        moduleId: item.moduleId,
        moduleTitle: item.moduleTitle,
        moduleColor: MODULE_COLORS[item.moduleId],
        lessonId: item.lessonId,
        lessonTitle: item.lessonTitle,
        snippet,
        matchedTitle: titleMatch,
        rank,
      };
    })
    .filter((r): r is NonNullable<typeof r> => r !== null)
    .sort((a, b) => a.rank - b.rank)
    .slice(0, limit)
    .map(({ rank, ...rest }) => rest);
}
