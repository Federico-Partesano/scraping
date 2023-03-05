import React, { FC, MouseEventHandler } from 'react';
import "./CustomButton.scss";

interface ICustomButton {
label: string;
onClick: MouseEventHandler<HTMLDivElement>
className?: string,
}

const CustomButton: FC<ICustomButton> = ({label, onClick, className=""}) => {
return (
    <div onClick={onClick} className={`custom__button ${className}`}><span>{label}</span></div>
)
};

export default CustomButton;