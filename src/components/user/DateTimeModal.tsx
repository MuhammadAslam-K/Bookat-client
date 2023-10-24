import React, { useState } from 'react';

interface DateTimePickerModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSelectDate: (date: Date) => void;
    handleScheduleBooking: () => void
}

const DateTimePickerModal: React.FC<DateTimePickerModalProps> = ({ isOpen, onClose, onSelectDate, handleScheduleBooking }) => {
    const [selectedDate, setSelectedDate] = useState(new Date());

    const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSelectedDate(new Date(event.target.value));
    };

    const handleTimeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const [hours, minutes] = event.target.value.split(':');
        setSelectedDate(prevState => {
            const newDate = new Date(prevState);
            newDate.setHours(Number(hours));
            newDate.setMinutes(Number(minutes));
            return newDate;
        });
    };

    const handleConfirm = () => {
        onSelectDate(selectedDate);
        onClose();
        handleScheduleBooking()
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className={`modal-overlay fixed inset-0 bg-black opacity-50 ${isOpen ? '' : 'hidden'}`}></div>
            <div className={`fixed inset-0 flex items-center justify-center z-50 ${isOpen ? '' : 'hidden'}`}>
                <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-300">
                    <h2 className="text-xl font-semibold mb-4">Select Date and Time</h2>
                    <div className="flex flex-col space-y-4">
                        <div className="flex items-center space-x-4">
                            <label className="text-gray-600">Date:</label>
                            <input
                                type="date"
                                value={selectedDate.toISOString().split('T')[0]}
                                onChange={handleDateChange}
                                min={new Date().toISOString().split('T')[0]}
                                className="p-2 rounded border border-gray-300"
                            />
                        </div>
                        <div className="flex items-center space-x-4">
                            <label className="text-gray-600">Time:</label>
                            <input
                                type="time"
                                value={`${selectedDate.getHours().toString().padStart(2, '0')}:${selectedDate.getMinutes().toString().padStart(2, '0')}`}
                                onChange={handleTimeChange}
                                className="p-2 rounded border border-gray-300"
                            />
                        </div>
                    </div>
                    <div className="mt-6 flex justify-end">
                        <button
                            onClick={handleConfirm}
                            className="bg-blue-500 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md mr-2"
                        >
                            Confirm
                        </button>
                        <button
                            onClick={onClose}
                            className="bg-gray-400 hover-bg-gray-600 text-white font-semibold py-2 px-4 rounded-md"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        </div>



    );
};

export default DateTimePickerModal;
