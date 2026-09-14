# AE 3D Align Tool

## Русский

Панель ScriptUI для After Effects: выравнивание и распределение 2D/3D-слоёв в координатах экрана. Иконки встроены в JSX; для установки нужен один файл.

### Обновление от 14 сентября 2026

- Добавлено центрирование по X/Y одним нажатием. В Selection центры нескольких слоёв совмещаются; Shift-клик центрирует всё выделение в композиции с сохранением смещений экранных центров.
- Исправлены геометрические границы масок: кривые, комбинации масок, инверсия и расширение.
- Родители обрабатываются раньше дочерних слоёв; зазоры пересчитываются при изменениях перспективной проекции.
- Selected Camera работает для Align и Distribute; состояния камер и блокировок восстанавливаются.
- Проверочные перемещения сохраняют ключи, easing и пространственные касательные. При неудачном решении изменения откатываются.
- Выражения без ключей не получают лишних ключей. Анимированный Position получает новый или обновлённый ключ на текущем кадре.
- Проверено: 11 Node-проверок и 18 тестов в After Effects 2026, не гарантия работы всех возможных сцен.

### Возможности

Выравнивание влево, по горизонтальному центру, вправо, вверх, по вертикальному центру, вниз и сразу по двум осям. 2D-слои используют координаты композиции; 3D-слои используют проекцию активной камеры, а без камеры стандартную проекцию AE. Локальный Position Z сохраняется.

- Режимы: Selection, Composition, Safe Margins (отступ 10%), First Selected и Selected Camera.
- Один слой в Selection выравнивается относительно композиции; несколько слоёв используют общие границы выделения.
- First Selected использует первый подходящий слой из API AE, а не порядок кликов мышью. Его экранный центр остаётся на месте.
- В Selected Camera выделите ровно одну камеру вместе со слоями. Текущий кадр должен попадать в её in/out.
- Распределение требует минимум трёх слоёв. Центральные кнопки задают равные зазоры между границами; крайние распределяют соответствующие края.
- Position с ключами обновляется на текущем кадре. Выражения поддерживаются по возможности через базовое значение Position без отключения выражения.
- Родительские связи учитываются через локальные изменения Position.
- Геометрия закрытых полностью непрозрачных масок поддерживает Add, Subtract, Intersect, Difference, Lighten и Darken; кривые аппроксимируются с точностью 0,05 пикселя слоя.

### Установка

1. Скачайте [AE_3D_Align_Tool.jsx](AE_3D_Align_Tool.jsx).
2. Поместите файл в папку установленного AE:
   - Windows: `C:\Program Files\Adobe\Adobe After Effects <version>\Support Files\Scripts\ScriptUI Panels\`
   - macOS: `/Applications/Adobe After Effects <version>/Scripts/ScriptUI Panels/`
3. Перезапустите AE и откройте `Window > AE_3D_Align_Tool.jsx`.

Для быстрого запуска используйте `File > Scripts > Run Script File...`: панель откроется отдельным окном. Папка с иконками не нужна.

### Ограничения

- Камеры, источники света, заблокированные слои и слои с разделённым Position пропускаются.
- Если выражение полностью игнорирует базовое значение Position, инструмент не сможет переместить слой без изменения выражения.
- Рассчитывается геометрия, не итоговая альфа: feather, эффекты, track mattes и посимвольный 3D-текст не учитываются. Частичная непрозрачность масок и пустой результат отменяют операцию.
- Вырожденные проекции и отсутствие сходимости отменяют операцию. Экстремальная перспектива и пересечение плоскости камеры не поддерживаются.
- При групповом центрировании 3D сохраняются смещения экранных центров, но проецируемые размеры могут меняться.
- Перед работой с важным проектом проверяйте инструмент на копии.

### Разработка и проверка

Исходник исправлений: `src/reliability.jsxinc`; сборка: `node tools/build-reliability.js`; генератор центральной иконки: `node tools/build-center-icon.js`. Clipper и лицензии находятся в `vendor/` и встроены в JSX. Экспортированные иконки: `AE_3D_Align_Tool_icons__test/`.

Запустите `node tests/regression.js`, затем `tests/ae-regression.jsx` в AE. Native-тест создаёт и удаляет временные композиции, результат пишет в `tests/artifacts/ae-results.txt`.

Для ручной проверки создайте композицию с наклонённой камерой, 2D/3D-текстом или solids на разных X/Y/Z. Проверьте центрирование относительно Composition, затем края и распределение в Selection.

---

## English

A dockable After Effects ScriptUI panel for aligning and distributing 2D/3D layers in screen space. Icons are embedded in the JSX; installation requires one file.

### Update: September 14, 2026

- Added one-click X/Y centering. In Selection, multiple layer centers coincide; Shift-click centers the whole selection in the composition while preserving screen-center offsets.
- Fixed geometric mask bounds: curves, mask combinations, inversion and expansion.
- Parents are processed before children; gaps are remeasured as perspective changes.
- Selected Camera works for Align and Distribute and restores camera/lock states.
- Probe moves preserve keys, easing and spatial tangents. Failed solutions roll back changes.
- Expression-only properties receive no extra keys. Animated Position receives an updated or new key at the current frame.
- Verified with 11 Node checks and 18 native After Effects 2026 tests, not a guarantee for every possible scene.

### Features

Align left, horizontal center, right, top, vertical center, bottom, or both axes at once. 2D layers use composition coordinates; 3D layers use the active camera projection, or AE's default projection without a camera. Local Position Z is preserved.

- Modes: Selection, Composition, Safe Margins (10% inset), First Selected and Selected Camera.
- One layer in Selection aligns to the composition; multiple layers use their combined selection bounds.
- First Selected uses the first movable layer returned by AE's API, not mouse-click order. Its screen center stays fixed.
- For Selected Camera, select exactly one camera with the layers. The current frame must fall within its in/out range.
- Distribution requires at least three layers. Center buttons create equal gaps between bounds; edge buttons distribute corresponding edges.
- Animated Position is updated at the current frame. Expressions are supported on a best-effort basis through the underlying Position value without disabling the expression.
- Parenting is handled through local Position adjustments.
- Closed fully opaque geometric masks support Add, Subtract, Intersect, Difference, Lighten and Darken; curves are flattened to 0.05 layer-pixel tolerance.

### Installation

1. Download [AE_3D_Align_Tool.jsx](AE_3D_Align_Tool.jsx).
2. Place it in your installed AE folder:
   - Windows: `C:\Program Files\Adobe\Adobe After Effects <version>\Support Files\Scripts\ScriptUI Panels\`
   - macOS: `/Applications/Adobe After Effects <version>/Scripts/ScriptUI Panels/`
3. Restart AE and open `Window > AE_3D_Align_Tool.jsx`.

For a quick run, use `File > Scripts > Run Script File...`: the panel opens as a floating window. No icon folder is required.

### Limitations

- Cameras, lights, locked layers and separated Position layers are skipped.
- Expressions that completely ignore the underlying Position value cannot be moved without changing the expression.
- Bounds are geometric, not rendered alpha: feather, effects, track mattes and per-character 3D text are not evaluated. Partial mask opacity and empty results cancel the operation.
- Degenerate projections and nonconvergent solutions cancel the operation. Extreme perspective and camera-plane crossings are unsupported.
- 3D group centering preserves screen-center offsets, but projected sizes may change.
- Test on a project copy before critical work.

### Development and Testing

Fix source: `src/reliability.jsxinc`; build: `node tools/build-reliability.js`; center icon generator: `node tools/build-center-icon.js`. Clipper and licenses are in `vendor/` and embedded in JSX. Exported icons: `AE_3D_Align_Tool_icons__test/`.

Run `node tests/regression.js`, then `tests/ae-regression.jsx` in AE. The native test creates and removes temporary compositions and writes `tests/artifacts/ae-results.txt`.

For a manual check, create a composition with an oblique camera and 2D/3D text or solids at different X/Y/Z positions. Check Composition centering, then edges and distribution in Selection.
