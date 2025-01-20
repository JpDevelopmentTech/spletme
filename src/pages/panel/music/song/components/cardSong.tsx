/* eslint-disable @typescript-eslint/no-explicit-any */
import ImageProfile from "../../../../../components/imageprofile/imageprofile";
import Title from "../../../../../components/title/title";
export default function CardSong({ data }: { data: any }) {
  return (
    <div className="flex gap-6 items-center col-span-7">
      <img
        src={data?.album.images[0].url}
        alt=""
        className="w-48 h-48 rounded-lg"
      />
      <div className="flex flex-col w-full">
        <Title
          title={data?.name}
          subtitle={data?.artists
            ?.map((item: any) => {
              return item.name;
            })
            .join(", ")}
        />
        <div className="flex -space-x-4 mt-3">
          {data?.artists.map((item: any) => (
            <ImageProfile id={item.id} />
          ))}
        </div>
        <span className="text-3xl font-semibold my-3">$2.000,00</span>
      </div>
    </div>
  );
}
