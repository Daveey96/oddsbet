import { useKeenSlider } from "keen-slider/react";
import Image from "next/image";
import React, { useEffect, useState } from "react";

function TopSlider() {
  const [mounted, setMounted] = useState(false);
  const [active, setActive] = useState(0);

  const [sliderRef, instanceRef] = useKeenSlider(
    {
      loop: true,
      dragSpeed: 1,
      rubberband: false,
      defaultAnimation: {
        duration: 1000,
      },
      slideChanged() {
        if (instanceRef?.current) {
          setActive(
            instanceRef.current.track.details.abs > 3
              ? instanceRef.current.track.details.abs % 4
              : instanceRef.current.track.details.abs
          );
        }
      },
    },
    [
      (slider) => {
        let timeout;
        let mouseOver = false;

        const clearNextTimeout = () => clearTimeout(timeout);
        const nextTimeout = () => {
          clearTimeout(timeout);
          if (mouseOver) return;
          timeout = setTimeout(() => {
            slider.next();
          }, 2500);
        };

        slider.on("created", () => {
          slider.container.addEventListener("mouseover", () => {
            mouseOver = true;
            nextTimeout();
          });
          slider.container.addEventListener("mouseout", () => {
            mouseOver = false;
            nextTimeout();
          });
          nextTimeout();
        });
        slider.on("dragStarted", clearNextTimeout);
        slider.on("animationEnded", nextTimeout);
        slider.on("updated", nextTimeout);
      },
    ]
  );

  useEffect(() => {
    setTimeout(() => setMounted(true), 1000);
  }, []);

  return (
    <div className="mt-10 relative w-[98%] fx">
      {mounted ? (
        <>
          <div ref={sliderRef} className="w-[98%] keen-slider h-24 mb-2">
            {["img1.png", "img2.jpg", "img3.jpg", "img4.jpeg"].map(
              (url, key) => (
                <div key={key} className="keen-slider__slide fx ">
                  <div className="w-[98vw] fx h-full rounded-xl bg-c4/30 overflow-hidden">
                    <Image
                      width={407}
                      height={80}
                      src={`/${url}`}
                      className=""
                      alt=""
                    />
                  </div>
                </div>
              )
            )}
          </div>
          <div className="absolute  bottom-0 pt-1.5 pb-3 rounded-t-xl px-4 bg-black/50 fx gap-2">
            {Array(4)
              .fill("")
              .map((i, key) => (
                <button
                  key={key}
                  onClick={() => instanceRef?.current?.moveToIdx(key)}
                  className={`w-2 rounded-full h-2  ${
                    key === active ? "bg-c2" : "backdrop-blur-xl bg-white/30"
                  }`}
                ></button>
              ))}
          </div>
        </>
      ) : (
        <div className="w-[98%] h-24 overflow-hidden mb-2 rounded-xl  bg-c4"></div>
      )}
    </div>
  );
}

export default TopSlider;
