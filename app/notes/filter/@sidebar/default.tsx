import Link from 'next/link';
import { NOTE_TAGS } from '@/types/note';
import css from './SidebarNotes.module.css';

export default function SidebarNotes() {
  return (
    <nav aria-label="Filter notes by tag">
      <ul className={css.menuList}>
        <li className={css.menuItem}>
          <Link className={css.menuLink} href="/notes/filter/all">
            All notes
          </Link>
        </li>
        {NOTE_TAGS.map((tag) => (
          <li className={css.menuItem} key={tag}>
            <Link className={css.menuLink} href={'/notes/filter/' + tag}>
              {tag}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
