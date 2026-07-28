"use client"

import * as React from "react"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel"

export function PhotoGallery( {images} ) {

  const IMAGES = images;



  const [api, setApi] = React.useState<CarouselApi>()
  const [current, setCurrent] = React.useState(0)

  React.useEffect(() => {
    if (!api) return

    setCurrent(api.selectedScrollSnap() + 1)
    api.on("select", () => {
      setCurrent(api.selectedScrollSnap() + 1)
    })
  }, [api])

  return (
    <div className="w-full relative group">
      <Carousel setApi={setApi} className="w-full overflow-hidden rounded-2xl border border-orange-200 shadow-xl">
        <CarouselContent>
          {IMAGES.map((image, index) => (
            <CarouselItem key={index}>
              <Card className="border-0 rounded-none overflow-hidden">
                {/* Yüksekliği mobil cihazlarda 350px, masaüstünde 550px yaptık */}
                <CardContent className="p-0 relative h-[350px] md:h-[550px] w-full">
                  <Image
                    src={image.src}
                    alt={image.alt}
                    fill
                    sizes="100vw"
                    className="object-cover"
                    priority={index === 0}
                  />
                  {/* Başlık Etiketi */}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent p-6 text-white">
                    <p className="text-base md:text-lg font-medium">{image.alt}</p>
                  </div>
                </CardContent>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>

        {/* Büyütülmüş Yön Okları */}
        <CarouselPrevious className="left-4 h-12 w-12 bg-white/90 hover:bg-orange-500 hover:text-white border-none shadow-lg transition-all text-gray-800" />
        <CarouselNext className="right-4 h-12 w-12 bg-white/90 hover:bg-orange-500 hover:text-white border-none shadow-lg transition-all text-gray-800" />
      </Carousel>

      {/* Sayfa Sayacı */}
      <div className="absolute top-4 right-4 bg-black/70 text-white text-xs md:text-sm px-3.5 py-1.5 rounded-full backdrop-blur-md font-semibold tracking-wide">
        {current} / {IMAGES.length}
      </div>
    </div>
  )
}