/* eslint-disable @typescript-eslint/no-explicit-any */
import img from "../../../../../assets/images/collaborator3.jpg";
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
        <div className="bg-gray-100 text-gray-800 text-sm font-medium me-2 px-2.5 py-0.5 rounded-full dark:bg-gray-700 dark:text-gray-300 flex items-center gap-3">
          <img
            className="w-10 h-10 rounded-full"
            src={img}
            alt="Rounded avatar"
          />
          Believe
        </div>
      </div>
    </div>
  );
}
