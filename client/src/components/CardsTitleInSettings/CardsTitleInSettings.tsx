import { CustomIcon } from "../CustomIcons/CustomIcons"

interface CardsTitleInSettingsProps {
    title: string,
    cardIsClose: boolean,
setCardIsClose:()=>void,
setShowAddModal: (boolean:boolean)=>void,
refreshCard: () => void

}

export const CardsTitleInSettings =({title, cardIsClose,refreshCard, setCardIsClose,setShowAddModal}:CardsTitleInSettingsProps)=>{

    return(
        <div className="flex gap-1 items-center justify-between">
                <div className="flex-1 justify-center">
                  <h2 className="">{title}</h2>
                </div>
                <button
                  className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-primary text-primary-foreground flex items-center justify-center flex-shrink-0"
                  onClick={() => setShowAddModal(true)}
                >
                  <CustomIcon name={"Plus"} />
                </button>
                <button
                  className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-secondary flex items-center justify-center flex-shrink-0"
                  onClick={refreshCard}
                >
                  <CustomIcon name={"RefreshCw"} />
                </button>
                <button
                  className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-secondary flex items-center justify-center flex-shrink-0"
                  onClick={setCardIsClose}
                >
                  <CustomIcon name={cardIsClose ? "ArrowDown" : "ArrowUp"} />
                </button>
              </div>
    )
}