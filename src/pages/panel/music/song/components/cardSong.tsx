/* eslint-disable @typescript-eslint/no-explicit-any */
import img from '../../../../../assets/images/collaborator3.jpg'
import ImageProfile from '../../../../../components/imageprofile/imageprofile'
import Title from '../../../../../components/title/title'
export default function CardSong({data} : {data:any}) {
  return (
    <div className="flex gap-6 items-center col-span-7">
    <img src={data?.album.images[0].url} alt="" className="w-48 h-48 rounded-lg" />
    <div className="flex flex-col">
      <Title title={data?.name} subtitle={data?.artists?.map((item: any) => {
        return item.name
      }).join(', ')}/>
      <div className="mt-3 flex ml-2">
        {data?.artists.map((item : any) => (
          <ImageProfile id={item.id} />
        
        ))}
      </div>
      <span className="text-3xl font-bold mt-3">$2.000,00</span>
      <div className="flex bg-senary rounded-full p-1 items-center gap-2 mt-3 w-1/2">
        <img src={img} className="w-8 h-8 rounded-full" alt="" />
        <span className="text-septenary">Believe</span>
      </div>
    </div>
  </div>
  )
}
