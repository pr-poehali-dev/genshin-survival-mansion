import { LocationData, AntagonistData } from '@/components/game/types';

export const useGameData = () => {
  const locations: LocationData[] = [
    { id: 'corridor', name: 'Коридоры', icon: 'Footprints', danger: 2, description: 'Тускло освещенные проходы, где слышны шаги' },
    { id: 'basement', name: 'Подвал', icon: 'Skull', danger: 5, description: 'Самое опасное место в особняке' },
    { id: 'library', name: 'Библиотека', icon: 'BookOpen', danger: 1, description: 'Древние знания и подсказки' },
    { id: 'attic', name: 'Чердак', icon: 'Package', danger: 3, description: 'Секретные предметы скрыты здесь' },
    { id: 'bedroom', name: 'Спальни', icon: 'Bed', danger: 2, description: 'Временное укрытие от опасности' },
    { id: 'kitchen', name: 'Кухня', icon: 'UtensilsCrossed', danger: 2, description: 'Источник ресурсов для выживания' }
  ];

  const antagonists: AntagonistData[] = [
    { id: 'dottore', name: 'Дотторе', threat: 'Эксперименты', icon: 'Syringe', color: 'text-blue-400' },
    { id: 'tartaglia', name: 'Тарталья', threat: 'Преследование', icon: 'Sword', color: 'text-cyan-400' },
    { id: 'venti', name: 'Венти', threat: 'Обман', icon: 'Wind', color: 'text-green-400' },
    { id: 'scaramouche', name: 'Скарамучча', threat: 'Гнев', icon: 'Zap', color: 'text-purple-400' },
    { id: 'sandrone', name: 'Сандроне', threat: 'Марионетки', icon: 'Bot', color: 'text-rose-400' }
  ];

  const rules = [
    '🕯️ Не оставайтесь в темноте дольше 30 секунд',
    '🔇 Не издавайте громких звуков в коридорах',
    '🚪 Всегда закрывайте двери за собой',
    '👁️ Не смотрите в глаза антагонистам',
    '📜 Не читайте вслух найденные записи',
    '🔦 Не тратьте батарею фонаря впустую'
  ];

  return { locations, antagonists, rules };
};
