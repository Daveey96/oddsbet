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
            Math.abs(instanceRef.current.track.details.abs) %
              (instanceRef.current.track.details.length + 1)
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
          }, 4500);
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

  useEffect(() => setMounted(true), []);

  return (
    <div className="mt-14 relative w-[98%] fx">
      {mounted ? (
        <>
          <div ref={sliderRef} className="w-[98%] keen-slider h-20 mb-2">
            {["img1.webp", "img2.webp", "img6.jpg"].map((url, key) => (
              <div key={url} className="keen-slider__slide fx ">
                <div className="w-[98vw] relative fx h-full rounded-xl bg-c4/30 overflow-hidden">
                  <Image
                    width={407}
                    height={80}
                    src={`/${url}`}
                    className=""
                    alt=""
                  />
                  <span className="absolute text-base flex items-center -inset-0.5 from-transparent bg-gradient-to-b to-black/90 z-20">
                    {key === 0 && (
                      <span className="w-full opacity-80 flex flex-col items-end text-right text-white px-6">
                        <span>Shoot!! and Score!!</span>
                        <div
                          className={`justify-center px-2 pb-0.5 h-9 flex z-10`}
                        >
                          <span className="mr-0.5 mt-0.5">with</span>
                          <Image
                            width={75}
                            height={10}
                            priority
                            className="scale-[0.85] -translate-y-1"
                            src={"/logo.svg"}
                            alt="Oddsbet logo"
                          />
                        </div>
                      </span>
                    )}
                    {key === 1 && (
                      <span className="w-full text-left text-c2/80 px-6">
                        Enjoy varieties of <br /> live events!!
                      </span>
                    )}
                    {key === 2 && (
                      <span className="w-full text-left text-gray-950 px-6">
                        Boost your earnings with <br /> Rocket Odds
                      </span>
                    )}
                  </span>
                </div>
              </div>
            ))}
          </div>
          <div className="absolute  bottom-0 pt-1.5 pb-2 rounded-t-xl px-4 dark:bg-black bg-white fx gap-2">
            {[0, 1, 2].map((i, key) => (
              <button
                key={key}
                onClick={() => instanceRef?.current?.moveToIdx(key)}
                className={`w-4 rounded-lg h-0.5  ${
                  key === active
                    ? "bg-c2"
                    : "backdrop-blur-xl dark:bg-white/30 bg-black/20"
                }`}
              ></button>
            ))}
          </div>
        </>
      ) : (
        <div className="w-[98%] h-20 overflow-hidden mb-2 rounded-xl  dark:bg-c4 bg-c5"></div>
      )}
    </div>
  );
}

export default TopSlider;
