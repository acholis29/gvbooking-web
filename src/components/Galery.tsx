"use client";
import { useState, useEffect } from "react";
import * as React from "react";
import "yet-another-react-lightbox/styles.css";
import Lightbox from "yet-another-react-lightbox";
import Video from "yet-another-react-lightbox/plugins/video";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPhotoFilm } from "@fortawesome/free-solid-svg-icons";
// Carousel Flowbite
import { Carousel } from "flowbite-react";
// Carousel Swiper
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import Image from "next/image";
import { safeSrc, sanitizeImage } from "@/helper/helper";

type GaleryProps = {
  picture?: string;
  galery?: string;
};

const Galery: React.FC<GaleryProps> = ({
  picture = "/images/destination/tanah-lot/tanah-lot6.jpg",
  galery = "/images/destination/tanah-lot/tanah-lot6.jpg",
}) => {
  const galleryArray = galery
    ? galery
        .split("|")
        .map((url) => url.trim())
        .filter((url) => url && url !== "" && url.startsWith("http"))
    : [];
  const [open, setOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  // galleryArray.unshift("/videos/bali-kaur.mp4"); //tambah vidio index 0
  // galleryArray.push("/videos/bali-kaur.mp4"); //tambah vidio index terakhir
  // galleryArray.splice(2, 0, "/videos/bali-kaur.mp4"); //sisipkan diindex 2

  const [isMobile, setIsMobile] = useState(false);
  // Image
  const [imgSrc0, setImgSrc0] = useState(
    "/images/icon/android-chrome-512x512.png"
  );
  const [hasError0, setHasError0] = useState(false);
  const [imgSrc1, setImgSrc1] = useState(
    "/images/icon/android-chrome-512x512.png"
  );
  const [hasError1, setHasError1] = useState(false);
  const [imgSrc2, setImgSrc2] = useState(
    "/images/icon/android-chrome-512x512.png"
  );
  const [hasError2, setHasError2] = useState(false);
  const [imgSrc3, setImgSrc3] = useState(
    "/images/icon/android-chrome-512x512.png"
  );
  const [hasError3, setHasError3] = useState(false);
  const [imgSrc4, setImgSrc4] = useState(
    "/images/icon/android-chrome-512x512.png"
  );
  const [hasError4, setHasError4] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768); // 768px = md breakpoint Tailwind
    };

    handleResize(); // Initial check
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (galleryArray.length > 0) {
      for (let index = 0; index < galleryArray.length; index++) {
        if (index == 0) {
          setImgSrc0(sanitizeImage(safeSrc(galleryArray[index])));
        }

        if (index == 1) {
          setImgSrc1(sanitizeImage(safeSrc(galleryArray[index])));
        }

        if (index == 2) {
          setImgSrc2(sanitizeImage(safeSrc(galleryArray[index])));
        }

        if (index == 3) {
          setImgSrc3(sanitizeImage(safeSrc(galleryArray[index])));
        }

        if (index == 4) {
          setImgSrc4(sanitizeImage(safeSrc(galleryArray[index])));
        }
      }
    }
  }, [galleryArray]);

  return (
    <>
      {galleryArray.length > 0 ? (
        <>
          {/* // Mode Desktop */}
          <div className="hidden md:grid grid-cols-3 gap-2 py-5">
            {/* Gambar Utama */}
            <div className="h-96">
              {galleryArray[0]?.endsWith(".mp4") ? (
                // Jika Vidio Tampilkan Tumbnile
                <div
                  className="relative w-full h-full cursor-pointer"
                  onClick={() => {
                    setSelectedIndex(0);
                    setOpen(true);
                  }}
                >
                  {/* <img
                    className="w-full h-full object-cover rounded-tl-sm rounded-bl-sm"
                    src="/images/thumbnile/thumbnile-vidio1.jpg" // ✅ thumbnail static
                    alt="Video Thumbnail"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.onerror = null;
                      target.src = "/images/icon/android-chrome-512x512.png";
                    }}
                  /> */}
                  <div className="relative w-full h-full">
                    <Image
                      className="object-cover rounded-tl-sm rounded-bl-sm"
                      src="/images/thumbnile/thumbnile-vidio1.jpg" // ✅ thumbnail static
                      alt="Video Thumbnail"
                      fill
                      sizes="(max-width: 768px) 260px, 25vw"
                      // onError={(e) => {
                      //   const target = e.target as HTMLImageElement;
                      //   target.onerror = null;
                      //   target.src = "/images/icon/android-chrome-512x512.png";
                      // }}
                      onError={() => {
                        if (!hasError0) {
                          setHasError0(true);
                          setImgSrc0("/images/icon/android-chrome-512x512.png");
                        }
                      }}
                    />
                  </div>
                  {/* Overlay icon play */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="bg-black/50 rounded-full p-4">▶ Play</div>
                  </div>
                </div>
              ) : (
                // Jika gambar
                // <img
                //   className="w-full h-full object-cover rounded-tl-sm rounded-bl-sm"
                //   src={galleryArray[0]}
                //   alt="Galery"
                //   onClick={() => {
                //     setSelectedIndex(0);
                //     setOpen(true);
                //   }}
                //   onError={(e) => {
                //     const target = e.target as HTMLImageElement;
                //     target.onerror = null;
                //     target.src = "/images/icon/android-chrome-512x512.png";
                //   }}
                // />
                <div className="relative w-full h-full">
                  <Image
                    // src={sanitizeImage(safeSrc(galleryArray[0]))}
                    src={imgSrc0}
                    alt="Galery"
                    fill
                    sizes="(max-width: 768px) 260px, 25vw"
                    className="object-cover rounded-tl-sm rounded-bl-sm"
                    onClick={() => {
                      setSelectedIndex(0);
                      setOpen(true);
                    }}
                    // onError={(e) => {
                    //   const target = e.target as HTMLImageElement;
                    //   target.onerror = null;
                    //   target.src = "/images/icon/android-chrome-512x512.png";
                    // }}
                    onError={() => {
                      if (!hasError0) {
                        setHasError0(true);
                        setImgSrc0("/images/icon/android-chrome-512x512.png");
                      }
                    }}
                  />
                </div>
              )}
            </div>
            <div className="">
              {galleryArray[1]?.endsWith(".mp4") ? (
                // Jika Vidio Tampilkan Tumbnile
                <div
                  className="relative w-full h-full cursor-pointer"
                  onClick={() => {
                    setSelectedIndex(1);
                    setOpen(true);
                  }}
                >
                  {/* <img
                    className="w-full h-full object-cover rounded-tl-sm rounded-bl-sm"
                    src="/images/thumbnile/thumbnile-vidio1.jpg" // ✅ thumbnail static
                    alt="Video Thumbnail"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.onerror = null;
                      target.src = "/images/icon/android-chrome-512x512.png";
                    }}
                  /> */}
                  <div className="relative w-full h-full">
                    <Image
                      className="object-cover rounded-tl-sm rounded-bl-sm"
                      src="/images/thumbnile/thumbnile-vidio1.jpg" // ✅ thumbnail static
                      alt="Video Thumbnail"
                      fill
                      sizes="(max-width: 768px) 260px, 25vw"
                      // onError={(e) => {
                      //   const target = e.target as HTMLImageElement;
                      //   target.onerror = null;
                      //   target.src = "/images/icon/android-chrome-512x512.png";
                      // }}
                      onError={() => {
                        if (!hasError1) {
                          setHasError1(true);
                          setImgSrc1("/images/icon/android-chrome-512x512.png");
                        }
                      }}
                    />
                  </div>
                  {/* Overlay icon play */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="bg-black/50 rounded-full p-4">▶ Play</div>
                  </div>
                </div>
              ) : (
                // <img
                //   className="w-full h-full object-cover"
                //   src={galleryArray[1]}
                //   alt="Galery"
                //   onClick={() => {
                //     setSelectedIndex(1); // index gambar yang diklik
                //     setOpen(true);
                //   }}
                //   onError={(e) => {
                //     const target = e.target as HTMLImageElement;
                //     target.onerror = null;
                //     target.src = "/images/icon/android-chrome-512x512.png";
                //   }}
                // />
                <div className="relative w-full h-full">
                  <Image
                    className="object-cover"
                    // src={sanitizeImage(safeSrc(galleryArray[1]))}
                    src={imgSrc1}
                    alt="Galery"
                    fill
                    sizes="(max-width: 768px) 260px, 25vw"
                    onClick={() => {
                      setSelectedIndex(1); // index gambar yang diklik
                      setOpen(true);
                    }}
                    // onError={(e) => {
                    //   const target = e.target as HTMLImageElement;
                    //   target.onerror = null;
                    //   target.src = "/images/icon/android-chrome-512x512.png";
                    // }}
                    onError={() => {
                      if (!hasError1) {
                        setHasError1(true);
                        setImgSrc1("/images/icon/android-chrome-512x512.png");
                      }
                    }}
                  />
                </div>
              )}
            </div>
            <div className="grid grid-rows-2 gap-2">
              <div className="">
                {galleryArray[2]?.endsWith(".mp4") ? (
                  // Jika Vidio Tampilkan Tumbnile
                  <div
                    className="relative w-full h-full cursor-pointer"
                    onClick={() => {
                      setSelectedIndex(2);
                      setOpen(true);
                    }}
                  >
                    {/* <img
                      className="w-full h-full object-cover rounded-tl-sm rounded-bl-sm"
                      src="/images/thumbnile/thumbnile-vidio1.jpg" // ✅ thumbnail static
                      alt="Video Thumbnail"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.onerror = null;
                        target.src = "/images/icon/android-chrome-512x512.png";
                      }}
                    /> */}
                    <div className="relative w-full h-full">
                      <Image
                        className="object-cover rounded-tl-sm rounded-bl-sm"
                        src="/images/thumbnile/thumbnile-vidio1.jpg" // ✅ thumbnail static
                        alt="Video Thumbnail"
                        fill
                        sizes="(max-width: 768px) 260px, 25vw"
                        // onError={(e) => {
                        //   const target = e.target as HTMLImageElement;
                        //   target.onerror = null;
                        //   target.src =
                        //     "/images/icon/android-chrome-512x512.png";
                        // }}
                        onError={() => {
                          if (!hasError2) {
                            setHasError2(true);
                            setImgSrc2(
                              "/images/icon/android-chrome-512x512.png"
                            );
                          }
                        }}
                      />
                    </div>
                    {/* Overlay icon play */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="bg-black/50 rounded-full p-4">▶ Play</div>
                    </div>
                  </div>
                ) : (
                  // <img
                  //   className="w-full h-full object-cover rounded-tr-sm"
                  //   src={galleryArray[2]}
                  //   alt="Galery"
                  //   onClick={() => {
                  //     setSelectedIndex(2); // index gambar yang diklik
                  //     setOpen(true);
                  //   }}
                  //   onError={(e) => {
                  //     const target = e.target as HTMLImageElement;
                  //     target.onerror = null;
                  //     target.src = "/images/icon/android-chrome-512x512.png";
                  //   }}
                  // />
                  <div className="relative w-full h-full">
                    <Image
                      className="object-cover rounded-tr-sm"
                      // src={sanitizeImage(safeSrc(galleryArray[2]))}
                      src={imgSrc2}
                      alt="Galery"
                      fill
                      sizes="(max-width: 768px) 260px, 25vw"
                      onClick={() => {
                        setSelectedIndex(2); // index gambar yang diklik
                        setOpen(true);
                      }}
                      // onError={(e) => {
                      //   const target = e.target as HTMLImageElement;
                      //   target.onerror = null;
                      //   target.src = "/images/icon/android-chrome-512x512.png";
                      // }}
                      onError={() => {
                        if (!hasError2) {
                          setHasError2(true);
                          setImgSrc2("/images/icon/android-chrome-512x512.png");
                        }
                      }}
                    />
                  </div>
                )}
              </div>
              <div className="relative">
                {galleryArray[3]?.endsWith(".mp4") ? (
                  // Jika Vidio Tampilkan Tumbnile
                  <div
                    className="relative w-full h-full cursor-pointer"
                    onClick={() => {
                      setSelectedIndex(3);
                      setOpen(true);
                    }}
                  >
                    {/* <img
                      className="w-full h-full object-cover rounded-tl-sm rounded-bl-sm"
                      src="/images/thumbnile/thumbnile-vidio1.jpg" // ✅ thumbnail static
                      alt="Video Thumbnail"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.onerror = null;
                        target.src = "/images/icon/android-chrome-512x512.png";
                      }}
                    /> */}
                    <div className="relative w-full h-full">
                      <Image
                        className="object-cover rounded-tl-sm rounded-bl-sm"
                        src="/images/thumbnile/thumbnile-vidio1.jpg" // ✅ thumbnail static
                        alt="Video Thumbnail"
                        fill
                        sizes="(max-width: 768px) 260px, 25vw"
                        // onError={(e) => {
                        //   const target = e.target as HTMLImageElement;
                        //   target.onerror = null;
                        //   target.src =
                        //     "/images/icon/android-chrome-512x512.png";
                        // }}
                        onError={() => {
                          if (!hasError3) {
                            setHasError3(true);
                            setImgSrc3(
                              "/images/icon/android-chrome-512x512.png"
                            );
                          }
                        }}
                      />
                    </div>
                    {/* Overlay icon play */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="bg-black/50 rounded-full p-4">▶ Play</div>
                    </div>
                  </div>
                ) : (
                  // <img
                  //   className="w-full h-full object-cover rounded-br-sm"
                  //   src={galleryArray[3]}
                  //   alt="Galery"
                  //   onClick={() => {
                  //     setSelectedIndex(3); // index gambar yang diklik
                  //     setOpen(true);
                  //   }}
                  //   onError={(e) => {
                  //     const target = e.target as HTMLImageElement;
                  //     target.onerror = null;
                  //     target.src = "/images/icon/android-chrome-512x512.png";
                  //   }}
                  // />
                  <div className="relative w-full h-full">
                    <Image
                      className="object-cover rounded-br-sm"
                      // src={sanitizeImage(safeSrc(galleryArray[3]))}
                      src={imgSrc3}
                      alt="Galery"
                      fill
                      sizes="(max-width: 768px) 260px, 25vw"
                      onClick={() => {
                        setSelectedIndex(3); // index gambar yang diklik
                        setOpen(true);
                      }}
                      // onError={(e) => {
                      //   const target = e.target as HTMLImageElement;
                      //   target.onerror = null;
                      //   target.src = "/images/icon/android-chrome-512x512.png";
                      // }}
                      onError={() => {
                        if (!hasError3) {
                          setHasError3(true);
                          setImgSrc3("/images/icon/android-chrome-512x512.png");
                        }
                      }}
                    />
                  </div>
                )}
                {/* Button pojok kanan bawah */}
                {galleryArray.length > 4 && (
                  <button
                    className="absolute bottom-2 right-2 
             px-3 py-1.5 text-sm 
             md:px-5 md:py-2 md:text-base
             border rounded-2xl 
             bg-black/40 hover:bg-black/60 
             shadow-md transition text-white cursor-pointer"
                    title="Lihat Galeri"
                    onClick={() => setOpen(true)}
                  >
                    <FontAwesomeIcon
                      icon={faPhotoFilm}
                      className="w-4 h-4 text-white mr-1 md:mr-2"
                    />
                    <span className="hidden md:inline">More</span> +
                    {galleryArray.length}
                  </button>
                )}
              </div>
            </div>
          </div>
          {/* Mode Handphone */}
          {isMobile ? (
            <div className="h-56 sm:h-64 xl:h-80 2xl:h-96 mt-3 md:hidden">
              <Swiper
                modules={[Autoplay, Pagination]}
                autoplay={{
                  delay: 3000,
                  disableOnInteraction: false,
                }}
                pagination={{
                  dynamicBullets: true,
                  clickable: true,
                }}
                loop={galleryArray.length > 1}
                spaceBetween={10}
                slidesPerView={1}
                className="w-full h-full"
              >
                {/* {galleryArray.map((img, index) => (
                  <SwiperSlide key={`swiper-${index}`}>
                    <img
                      src={img}
                      className="w-full h-full object-cover"
                      alt={`Gallery ${index + 1}`}
                      onClick={() => {
                        setSelectedIndex(index);
                        setOpen(true);
                      }}
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.onerror = null;
                        target.src = "/images/icon/android-chrome-512x512.png";
                      }}
                    />
                  </SwiperSlide>
                ))} */}

                {galleryArray.map((media, index) => (
                  <SwiperSlide key={`swiper-${index}`}>
                    {media.endsWith(".mp4") ? (
                      // Jika Vidio Maka Tampilkan Tumbnile
                      <div
                        className="relative cursor-pointer w-full h-full"
                        onClick={() => {
                          setSelectedIndex(index);
                          setOpen(true);
                        }}
                      >
                        {/* Thumbnail dari video */}
                        <video
                          className="w-full h-full object-cover rounded"
                          poster="/images/thumbnile/thumbnile-vidio1.jpg" // ✅ thumbnail static
                        />
                        {/* Overlay icon play */}
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="bg-black/50 rounded-full p-4 text-white text-3xl">
                            ▶ Play
                          </div>
                        </div>
                      </div>
                    ) : (
                      // Jika Gambar
                      // <img
                      //   src={media}
                      //   className="w-full h-full object-cover rounded"
                      //   alt={`Gallery ${index + 1}`}
                      //   onClick={() => {
                      //     setSelectedIndex(index);
                      //     setOpen(true);
                      //   }}
                      //   onError={(e) => {
                      //     const target = e.target as HTMLImageElement;
                      //     target.onerror = null;
                      //     target.src =
                      //       "/images/icon/android-chrome-512x512.png";
                      //   }}
                      // />
                      <div className="relative w-full h-full">
                        <Image
                          src={sanitizeImage(safeSrc(media))}
                          className="object-cover rounded"
                          alt={`Gallery ${index + 1}`}
                          fill
                          sizes="(max-width: 768px) 260px, 25vw"
                          onClick={() => {
                            setSelectedIndex(index);
                            setOpen(true);
                          }}
                          // onError={(e) => {
                          //   const target = e.target as HTMLImageElement;
                          //   target.onerror = null;
                          //   target.src =
                          //     "/images/icon/android-chrome-512x512.png";
                          // }}
                          onError={() => {
                            if (!hasError4) {
                              setHasError4(true);
                              setImgSrc4(
                                "/images/icon/android-chrome-512x512.png"
                              );
                            }
                          }}
                        />
                      </div>
                    )}
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          ) : null}
        </>
      ) : (
        <div className="grid grid-cols-1 gap-2 py-5">
          {/* Gambar Utama */}
          <div className="">
            {/* <img
              className="w-full h-full object-cover rounded-tl-sm rounded-bl-sm"
              src={"/images/error/no-image.svg"}
              alt="Galery"
              onClick={() => {
                setSelectedIndex(0); // index gambar yang diklik
                setOpen(true);
              }}
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.onerror = null;
                target.src = "/images/icon/android-chrome-512x512.png";
              }}
            /> */}
            <div className="relative w-full h-full">
              <Image
                className="object-cover rounded-tl-sm rounded-bl-sm"
                src={"/images/error/no-image.svg"}
                alt="Galery"
                fill
                sizes="(max-width: 768px) 260px, 25vw"
                onClick={() => {
                  setSelectedIndex(0); // index gambar yang diklik
                  setOpen(true);
                }}
                // onError={(e) => {
                //   const target = e.target as HTMLImageElement;
                //   target.onerror = null;
                //   target.src = "/images/icon/android-chrome-512x512.png";
                // }}
                onError={() => {
                  if (!hasError4) {
                    setHasError4(true);
                    setImgSrc4("/images/icon/android-chrome-512x512.png");
                  }
                }}
              />
            </div>
          </div>
        </div>
      )}

      {/* LightBox */}
      <Lightbox
        open={open}
        close={() => setOpen(false)}
        plugins={[Video]}
        styles={{ container: { backgroundColor: "rgba(0, 0, 0, .8)" } }}
        className="tailwind-lightbox"
        index={selectedIndex}
        slides={galleryArray.map((media) =>
          media.endsWith(".mp4")
            ? {
                type: "video",
                sources: [
                  {
                    src: media, // path video, misalnya "/videos/bali-kaur.mp4"
                    type: "video/mp4",
                  },
                ],
                autoPlay: true,
                controls: true,
              }
            : {
                src: media, // path image
                width: 3840,
                height: 2560,
              }
        )}
      />

      {/* Asli */}
      {/* <Lightbox
        open={open}
        close={() => setOpen(false)}
        plugins={[Video]}
        styles={{ container: { backgroundColor: "rgba(0, 0, 0, .8)" } }}
        className="tailwind-lightbox"
        index={selectedIndex}
        slides={galleryArray.map((img) => ({
          src: img,
          width: 3840, // Atau ganti sesuai kebutuhan
          height: 2560,
        }))}
      /> */}

      {/* Grid Thumbnail */}
      {/* <div className="max-w-screen-xl mx-auto px-4 pb-4">
        <div className="overflow-x-auto md:overflow-visible">
          <div className="flex md:grid md:grid-cols-5 gap-4 min-w-max md:min-w-0">
            {galleryArray.map((img, i) => (
              <div
                key={i}
                className="flex-shrink-0 w-40 md:w-full cursor-pointer"
              >
                <img
                  className="w-full h-28 object-cover rounded-lg hover:opacity-80 transition"
                  src={img}
                  alt={`Gambar ${i + 1}`}
                  onClick={() => setMainImage(img)}
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.onerror = null;
                    target.src = "/images/icon/android-chrome-512x512.png";
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      </div> */}
    </>
  );
};

export default Galery;
