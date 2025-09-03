import { lazy, Suspense, useMemo, memo } from "react";
import type { IconId } from "./manifest.ts";

type IconProps = {
  id: IconId;
  size?: number;
  color?: string;
  stroke?: string;
} & React.SVGProps<SVGSVGElement>;

// Кэш для lazy компонентов
const iconCache = new Map<
  string,
  React.LazyExoticComponent<React.ComponentType<React.SVGProps<SVGSVGElement>>>
>();

// Функция для получения или создания lazy компонента
function getLazyIcon(id: IconId) {
  if (iconCache.has(id)) {
    return iconCache.get(id)!;
  }

  const LazyIcon = lazy(async () => {
    const { manifest } = await import("./manifest.ts");
    const path = manifest[id];
    if (!path) throw new Error(`Icon not found: ${String(id)}`);
    const mod = (await import(/* @vite-ignore */ path as string)) as {
      default: React.ComponentType<React.SVGProps<SVGSVGElement>>;
    };
    return { default: mod.default };
  });

  iconCache.set(id, LazyIcon);
  return LazyIcon;
}

export default memo(function Icon({
  id,
  size = 16,
  color = "transparent",
  stroke,
  ...props
}: IconProps) {
  // Используем useMemo для предотвращения пересоздания компонента
  const LazyIcon = useMemo(() => getLazyIcon(id), [id]);

  // Подготавливаем пропсы для SVG
  const svgProps = {
    width: size,
    height: size,
    fill: color,
    ...(stroke && {
      stroke,
      style: {
        "--icon-stroke": stroke,
      } as React.CSSProperties,
    }),
    ...props,
  };

  return (
    <Suspense fallback={null}>
      <div
        style={
          stroke
            ? ({
                "--icon-stroke": stroke,
              } as React.CSSProperties)
            : undefined
        }
        className={stroke ? "icon-with-stroke" : undefined}
      >
        <LazyIcon {...svgProps} />
      </div>
    </Suspense>
  );
});
