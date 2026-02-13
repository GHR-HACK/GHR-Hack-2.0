"use client";

import * as React from "react";
import type { EmblaCarouselType } from "embla-carousel-react";
import useEmblaCarousel from "embla-carousel-react";
import type { EmblaOptionsType, EmblaPluginType } from "embla-carousel";
import { ArrowLeft, ArrowRight } from "lucide-react";

import { cn } from "@/lib/utils";

type CarouselProps = {
  opts?: EmblaOptionsType;
  plugins?: EmblaPluginType[];
  orientation?: "horizontal" | "vertical";
  setApi?: (api: EmblaCarouselType) => void;
};

const CarouselContext = React.createContext<{
  carouselRef: ReturnType<typeof useEmblaCarousel>[0];
  api: EmblaCarouselType | undefined;
  scrollPrev: () => void;
  scrollNext: () => void;
  canScrollPrev: boolean;
  canScrollNext: boolean;
} | null>(null);

const Carousel = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & CarouselProps
>(({ orientation = "horizontal", opts, setApi, plugins, className, ...props }, ref) => {
  const [carouselRef, api] = useEmblaCarousel(
    {
      ...opts,
      axis: orientation === "horizontal" ? "x" : "y",
    },
    plugins
  );
  const [canScrollPrev, setCanScrollPrev] = React.useState(false);
  const [canScrollNext, setCanScrollNext] = React.useState(false);

  const onSelect = React.useCallback((emblaApi: EmblaCarouselType) => {
    setCanScrollPrev(emblaApi.canScrollPrev());
    setCanScrollNext(emblaApi.canScrollNext());
  }, []);

  const scrollPrev = React.useCallback(() => api?.scrollPrev(), [api]);
  const scrollNext = React.useCallback(() => api?.scrollNext(), [api]);

  React.useEffect(() => {
    if (!api) {
      return;
    }

    setApi?.(api);
    onSelect(api);
    api.on("reInit", onSelect);
    api.on("select", onSelect);

    return () => {
      api.off("select", onSelect);
      api.off("reInit", onSelect);
    };
  }, [api, onSelect, setApi]);

  return (
    <CarouselContext.Provider
      value={{
        carouselRef,
        api,
        scrollPrev,
        scrollNext,
        canScrollPrev,
        canScrollNext,
      }}
    >
      <div ref={ref} className={cn("relative", className)} {...props} />
    </CarouselContext.Provider>
  );
});
Carousel.displayName = "Carousel";

const useCarousel = () => {
  const context = React.useContext(CarouselContext);
  if (!context) {
    throw new Error("useCarousel must be used within a <Carousel />");
  }
  return context;
};

const CarouselContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const { carouselRef } = useCarousel();

  return (
    <div ref={carouselRef} className="overflow-hidden">
      <div
        ref={ref}
        className={cn(
          "flex",
          className
        )}
        {...props}
      />
    </div>
  );
});
CarouselContent.displayName = "CarouselContent";

const CarouselItem = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      role="group"
      aria-roledescription="slide"
      className={cn("min-w-0 shrink-0 grow-0 basis-full", className)}
      {...props}
    />
  );
});
CarouselItem.displayName = "CarouselItem";

const CarouselPrevious = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ className, ...props }, ref) => {
  const { canScrollPrev, scrollPrev } = useCarousel();

  return (
    <button
      ref={ref}
      className={cn(
        "absolute left-4 top-1/2 -translate-y-1/2 rounded-full border border-slate-200 bg-white/90 p-2 text-slate-900 shadow-sm transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      disabled={!canScrollPrev}
      onClick={scrollPrev}
      {...props}
    >
      <ArrowLeft className="h-4 w-4" />
      <span className="sr-only">Previous slide</span>
    </button>
  );
});
CarouselPrevious.displayName = "CarouselPrevious";

const CarouselNext = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ className, ...props }, ref) => {
  const { canScrollNext, scrollNext } = useCarousel();

  return (
    <button
      ref={ref}
      className={cn(
        "absolute right-4 top-1/2 -translate-y-1/2 rounded-full border border-slate-200 bg-white/90 p-2 text-slate-900 shadow-sm transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      disabled={!canScrollNext}
      onClick={scrollNext}
      {...props}
    >
      <ArrowRight className="h-4 w-4" />
      <span className="sr-only">Next slide</span>
    </button>
  );
});
CarouselNext.displayName = "CarouselNext";

export {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
};
