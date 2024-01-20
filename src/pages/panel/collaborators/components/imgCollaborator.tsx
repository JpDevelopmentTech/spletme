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
            ? "w-12 rounded-full h-12 object-cover cursor-pointer"
            : "w-12 h-12 object-cover rounded-full grayscale cursor-pointer"
        }
        onClick={changeActive}
      />
    </>
  );
}
