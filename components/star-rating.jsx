
import Image from "next/image";

export function StarRating({ rating }) {
  const ratings = new Array(rating).fill(0);

  return (
    <>
      {ratings.map((star, index) => (
        <Image key={index} src={`/assets/star.svg`} width={20} height={20} alt="rating" />
      ))}
    </>
  );
}