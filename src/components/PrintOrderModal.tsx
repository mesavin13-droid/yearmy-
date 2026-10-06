import React, { useState } from 'react';
import { X, Check, Truck, ShieldCheck, Heart, Sparkles, Printer, ArrowRight } from 'lucide-react';
import { PRICING_PLANS } from '../services/storage';
import { Calendar } from '../types/calendar';
import { TelegramService } from '../services/telegram';

interface PrintOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  calendar: Calendar;
}

export const PrintOrderModal: React.FC<PrintOrderModalProps> = ({
  isOpen,
  onClose,
  calendar,
}) => {
  const [selectedPlanId, setSelectedPlanId] = useState<string>('print_single');
  const [recipientName, setRecipientName] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [city, setCity] = useState<string>('Москва');
  const [deliveryAddress, setDeliveryAddress] = useState<string>('');
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

  if (!isOpen) return null;

  const selectedPlan = PRICING_PLANS.find((p) => p.id === selectedPlanId) || PRICING_PLANS[2];

  const handleOrder = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
    TelegramService.triggerHaptic('success');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
      <div className="w-full max-w-lg bg-[#FAF7F2] rounded-3xl p-5 sm:p-6 border border-[#E8DFD3] shadow-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#ECE4D8] mb-4">
          <div className="flex items-center gap-2">
            <Printer className="w-5 h-5 text-[#A6533A]" />
            <h3 className="font-editorial text-2xl font-bold text-[#2C2723]">
              Печать календаря
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-[#70665D] hover:bg-[#EFE9DF]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {isSubmitted ? (
          <div className="text-center py-8">
            <div className="w-14 h-14 bg-[#F2F7F0] text-[#5B795A] rounded-full flex items-center justify-center mx-auto mb-4 border border-[#D5E5D1]">
              <Check className="w-8 h-8 stroke-[2.5]" />
            </div>
            <h4 className="font-editorial text-3xl font-bold text-[#2C2723] mb-2">
              Заказ успешно оформлен!
            </h4>
            <p className="text-xs text-[#70665D] max-w-sm mx-auto mb-4 leading-relaxed">
              Мы начали предпечатную подготовку вашего семейного календаря <strong>{calendar.year}</strong>.
              Курьерская доставка по адресу: {city}, {deliveryAddress || 'указанному адресу'}.
            </p>
            <div className="bg-white p-3.5 rounded-2xl border border-[#ECE4D8] text-xs text-[#554B41] max-w-xs mx-auto mb-6">
              <div className="flex justify-between py-1">
                <span>Тариф:</span>
                <span className="font-semibold">{selectedPlan.title}</span>
              </div>
              <div className="flex justify-between py-1">
                <span>Сумма к оплате:</span>
                <span className="font-bold text-[#A6533A]">{selectedPlan.priceRub} ₽</span>
              </div>
            </div>
            <button
              onClick={() => {
                setIsSubmitted(false);
                onClose();
              }}
              className="px-6 py-2.5 bg-[#2C2723] text-white text-xs font-semibold rounded-xl hover:bg-[#433B35]"
            >
              Вернуться в приложение
            </button>
          </div>
        ) : (
          <form onSubmit={handleOrder} className="space-y-4">
            {/* Tariff Selector */}
            <div>
              <label className="block text-xs font-semibold text-[#4A423A] mb-2">
                Выберите формат заказа:
              </label>
              <div className="space-y-2">
                {PRICING_PLANS.map((plan) => {
                  const isSelected = selectedPlanId === plan.id;
                  return (
                    <div
                      key={plan.id}
                      onClick={() => setSelectedPlanId(plan.id)}
                      className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                        isSelected
                          ? 'bg-white border-[#2C2723] ring-2 ring-[#2C2723] shadow-xs'
                          : 'bg-white border-[#ECE4D8] hover:border-[#D5C7B5]'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="text-xs font-bold text-[#2C2723]">{plan.title}</h4>
                            {plan.isPopular && (
                              <span className="text-[9px] bg-[#F7EFE2] text-[#A6533A] px-2 py-0.2 rounded-md font-bold uppercase">
                                Хит
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-[#7A6F64] mt-0.5 leading-relaxed">
                            {plan.description}
                          </p>
                        </div>
                        <div className="text-right shrink-0">
                          <div className="text-sm font-bold text-[#2C2723]">
                            {plan.priceRub} ₽
                          </div>
                          {plan.originalPriceRub && (
                            <div className="text-[10px] text-[#A6998B] line-through">
                              {plan.originalPriceRub} ₽
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Delivery Details */}
            {selectedPlanId !== 'pdf_export' && selectedPlanId !== 'premium_gen' && (
              <div className="bg-white p-4 rounded-2xl border border-[#ECE4D8] space-y-3">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-[#4A423A]">
                  <Truck className="w-3.5 h-3.5 text-[#A6533A]" />
                  <span>Курьерская доставка</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    required
                    placeholder="Ваше имя"
                    value={recipientName}
                    onChange={(e) => setRecipientName(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-[#DCD2C4] bg-[#FAF8F5] text-[#2C2723] focus:bg-white focus:outline-hidden focus:border-[#A6533A]"
                  />
                  <input
                    type="tel"
                    required
                    placeholder="+7 (999) 000-00-00"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-[#DCD2C4] bg-[#FAF8F5] text-[#2C2723] focus:bg-white focus:outline-hidden focus:border-[#A6533A]"
                  />
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <input
                    type="text"
                    placeholder="Город"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-[#DCD2C4] bg-[#FAF8F5] text-[#2C2723] focus:bg-white focus:outline-hidden focus:border-[#A6533A]"
                  />
                  <input
                    type="text"
                    required
                    placeholder="Улица, дом, квартира"
                    value={deliveryAddress}
                    onChange={(e) => setDeliveryAddress(e.target.value)}
                    className="col-span-2 w-full px-3 py-2 text-xs rounded-xl border border-[#DCD2C4] bg-[#FAF8F5] text-[#2C2723] focus:bg-white focus:outline-hidden focus:border-[#A6533A]"
                  />
                </div>
              </div>
            )}

            {/* Submit CTA */}
            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-3.5 bg-[#A6533A] hover:bg-[#924731] text-white text-xs font-semibold rounded-xl flex items-center justify-center gap-2 shadow-sm transition-all"
              >
                <span>Оформить заказ · {selectedPlan.priceRub} ₽</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
              <div className="text-[10px] text-center text-[#8C7F72] mt-2 flex items-center justify-center gap-1">
                <ShieldCheck className="w-3 h-3 text-[#5B795A]" />
                <span>Гарантия качества печати и бережная упаковка</span>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
