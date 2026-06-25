export default function ImgCollaborator({
  img,
  active,
  index,
  changeActive,
}: {
  img: string;
  active: number;
  index: number;
  changeActive: () => void;
}) {
  return (
    <>
      <img
        src={img}
        alt=""
        className={
          active === index
            ? "h-12 w-12 cursor-pointer rounded-full object-cover"
            : "h-12 w-12 cursor-pointer rounded-full object-cover grayscale"
        }
        onClick={changeActive}
      />
    </>
  );
}
