import { useState } from "react";
import { usePaymentMethodsStore } from "../../store/paymentMethodsStore";
import { CustomIcon } from "../CustomIcons/CustomIcons";
import { Loader } from "../Loading/Loader";
import { EditDelete } from "../EditDelete/EditDelete";
import { CardsTitleInSettings } from "../CardsTitleInSettings/CardsTitleInSettings";
import type { UserPaymentMethodDB } from "@shared/core";
import { CreateEditPaymentMethodModal } from "../CreateEditPaymentMethodModal/CreateEditPaymentMethodModal";

export const PaymentMethodsCard = () => {
  const paymentMethodStore = usePaymentMethodsStore();
  const { paymentMethods } = usePaymentMethodsStore();
  const [collapsePMCard, setColapsePMCard] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);  
  const [formData, setFormData] = useState<UserPaymentMethodDB>();
  

  const openCard = () => {
    setColapsePMCard(!collapsePMCard);
  };

  const refreshPM = () => {
    setColapsePMCard(false);
    paymentMethodStore.getUserPaymentMethods();
  };

  const handleEdit = (paymentMethod: UserPaymentMethodDB) => {
    setFormData(paymentMethod)
    setShowAddModal(true);
  };

  const handleDelete = (id: number) => {
    paymentMethodStore.deleteUserPaymentMethod(id);
  };

  const closeModal = () => {
    setFormData(undefined);
    setShowAddModal(false);
  };

  return (
    <div
      className={`
            bg-card flex flex-col gap-4 
            border border-border rounded-2xl 
            p-5 sm:p-6 md:p-8 shadow-sm
            `}
    >
      <CardsTitleInSettings
        title="Payment Methods"
        cardIsClose={collapsePMCard}
        setCardIsClose={openCard}
        refreshCard={refreshPM}
        setShowAddModal={setShowAddModal}
      />

      {!collapsePMCard && (
        <div>
          <Loader loading={paymentMethodStore.paymentMethodsStatus === "loading"} center size={48}>
            {paymentMethodStore.paymentMethodsStatus === "error" ? <p>Something went wrong.</p> : null}

            {paymentMethods.length === 0 ? (
              <div className="flex flex-col gap-2 items-center">
                <p className="text-sm text-muted-foreground">No payment methods yet. Click "Add" to create one!</p>
                //{" "}
                {/* <div className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-primary text-primary-foreground flex items-center justify-center flex-shrink-0"> */}
                <button
                  className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-primary/80 text-primary-foreground flex items-center justify-center flex-shrink-0"
                  onClick={() => setShowAddModal(true)}
                >
                  <CustomIcon name={"Plus"} />
                </button>
                {/* </div> */}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 xl:grid-cols-3 xxl:grid-cols-4 gap-4">
                {paymentMethods.map((paymentMethod) => (
                  <div
                    key={paymentMethod.user_payment_method_id}
                    className="flex items-center gap-4 p-4 md:p-3 bg-card rounded-xl border border-border shadow-sm group hover:shadow-md transition-all"
                  >
                    <div
                      className="w-14 h-14 md:w-16 md:h-16 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: paymentMethod.user_payment_method_color + "20" }}
                    >
                      <CustomIcon
                        name={paymentMethod.user_payment_method_icon || ""}
                        color={paymentMethod.user_payment_method_color}
                        size={24}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="truncate">{paymentMethod.user_payment_method_name}</h4>
                    </div>
                    <div className="flex flex-col gap-0.5 opacity-40 group-hover:opacity-100 transition-opacity">
                      <EditDelete
                        onEdit={() => handleEdit(paymentMethod)}
                        onDelete={() => handleDelete(paymentMethod.user_payment_method_id)}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Loader>
        </div>
      )}

      {/* Add/Edit Modal */}
      {showAddModal && (
        <CreateEditPaymentMethodModal addModalOpen={showAddModal} setAddModalOpen={closeModal} dataForUpdate={formData} />
      )}
    </div>
  );
};
