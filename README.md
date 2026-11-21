# NoteHub

Версія NoteHub із фільтрацією за тегами через паралельні маршрути. Вибраний тег зберігається в URL. При переході зі списку деталі нотатки відкриваються в модальному вікні поверх списку. Пряме відкриття посилання показує окрему сторінку деталей.

## Запуск

Потрібні Node.js 24 і pnpm 10. Додайте токен навчального NoteHub API до серверної змінної середовища `NOTEHUB_TOKEN`. Проєкт також підтримує `NEXT_PUBLIC_NOTEHUB_TOKEN` як сумісне ім’я в серверному модулі.

```bash
pnpm install --frozen-lockfile
pnpm dev
```

За замовчуванням застосунок доступний за адресою http://localhost:3000.

```bash
pnpm check
pnpm format:check
pnpm build
```

Для Vercel виберіть пресет Next.js і додайте `NOTEHUB_TOKEN` у змінних середовища проєкту. Для публічного демо використовуйте токен окремої навчальної колекції.

Проєкт розвиває домашні роботи `06-notehub-nextjs` та [05-notehub](https://github.com/slipkoliudmyla/05-notehub). Початковий код `05-notehub` походить із [sofiiadorosh/05-notehub](https://github.com/sofiiadorosh/05-notehub).
