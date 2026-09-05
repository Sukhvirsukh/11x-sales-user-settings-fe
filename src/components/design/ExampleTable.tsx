
export default function ExampleTable() {
    return (
        <div className="flex p-2.5 flex-col items-start gap-3.5 rounded-[10px] border border-[rgba(53,118,243,0.20)] bg-[#F7F8FB] min-w-screen min-h-screen absolute left-4 top-4 overflow-hidden">
            <div className="flex justify-between items-center w-full">
                <button className="cursor-pointer text-nowrap flex justify-center items-center gap-2.5 w-fit">
                    <p className="text-[#000] font-inter text-base font-medium leading-none w-fit">
                        Payment history
                    </p>
                </button>
                <div className="flex items-center gap-2.5 w-fit">
                    <div className="flex p-2.5 justify-between items-center rounded-[10px] border border-[rgba(53,118,243,0.20)] bg-[#F7F8FB] w-[231px]">
                        <div className="flex items-center gap-2 w-fit">
                            <svg
                                width="14"
                                height="14"
                                viewBox="0 0 14 14"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                                className="w-3.5 h-3.5 overflow-hidden relative "
                            >
                                <path
                                    d="M12.25 12.25L9.7125 9.7125M11.0833 6.41667C11.0833 8.994 8.994 11.0833 6.41667 11.0833C3.83934 11.0833 1.75 8.994 1.75 6.41667C1.75 3.83934 3.83934 1.75 6.41667 1.75C8.994 1.75 11.0833 3.83934 11.0833 6.41667Z"
                                    stroke="#1E1E1E"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                            </svg>
                            <p className="text-[#808080] font-inter text-sm w-fit">Search</p>
                        </div>
                        <svg
                            width="14"
                            height="14"
                            viewBox="0 0 14 14"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            className="shrink-0 w-3.5 h-3.5 overflow-hidden relative "
                        >
                            <path
                                d="M2.625 4.08301H11.375M4.08333 6.99967H9.91667M5.83333 9.91634H8.16667"
                                stroke="#808080"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                    </div>
                    <div className="flex py-2.5 px-4 items-center gap-2 rounded-[10px] bg-[#3576F3] w-[138px]">
                        <p className="text-[#FFF] font-inter text-sm font-medium w-fit">
                            New payment
                        </p>
                        <svg
                            width="14"
                            height="14"
                            viewBox="0 0 14 14"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            className="shrink-0 w-3.5 h-3.5 overflow-hidden relative "
                        >
                            <path
                                d="M6.99996 2.91663V11.0833M2.91663 6.99996H11.0833"
                                stroke="white"
                                strokeWidth="1.2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                    </div>
                </div>
            </div>

            {/* common table */}
            <div className="flex flex-col items-start rounded-lg border border-[rgba(53,118,243,0.20)] bg-[#FFF] w-full overflow-hidden">
                <div className="flex py-2.5 px-5 items-center rounded-[10px] bg-[#E8EEFB] w-full overflow-hidden">
                    <p className="text-[#000] font-inter text-xs w-[553px]">
                        Invoice number
                    </p>
                    <p className="text-[#000] font-inter text-xs w-full">Status</p>
                    <p className="text-[#000] font-inter text-xs w-full">Start date</p>
                    <p className="text-[#000] font-inter text-xs w-full">Amount</p>
                    <p className="text-[#000] font-inter text-xs w-full text-right">
                        Method
                    </p>
                    <p className="text-[#000] font-inter text-xs w-full text-right">
                        Action
                    </p>
                </div>
                <div className="flex pl-2.5 flex-col items-start gap-2.5 w-full">
                    <div className="flex py-2 px-0 items-center w-[1133px]">
                        <div className="flex items-center gap-1.5 shrink-0 w-[539px]">
                            <svg
                                width="18"
                                height="18"
                                viewBox="0 0 18 18"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                                className="shrink-0 w-[18px] h-[18px] overflow-hidden relative "
                            >
                                <path
                                    d="M14.25 5.25C14.25 4.425 13.575 3.75 12.75 3.75H5.25C4.425 3.75 3.75 4.425 3.75 5.25V12.75C3.75 13.575 4.425 14.25 5.25 14.25H12.75C13.575 14.25 14.25 13.575 14.25 12.75V5.25ZM5.25 12.75V5.25H12.75V12.75H5.25Z"
                                    fill="black"
                                />
                            </svg>
                            <p className="text-[#000] font-inter text-sm w-fit">
                                S456RT789P1116
                            </p>
                        </div>
                        <div className="flex flex-col items-start gap-2.5 shrink-0 w-[87px]">
                            <button className="cursor-pointer text-nowrap flex py-1 px-2 justify-center items-center gap-2 rounded-[10px] bg-[#E5FFD8] w-fit">
                                <p className="text-[#808080] font-inter text-xs w-fit">
                                    Active
                                </p>
                                <div className="w-[7px] h-[7px]"></div>
                            </button>
                        </div>
                        <p className="shrink-0 text-[#000] font-inter text-sm w-[107px] text-right">
                            10&#x2F;02&#x2F;26
                        </p>
                        <p className="shrink-0 text-[#000] font-inter text-sm w-[98px] text-right">
                            INR 450
                        </p>
                        <p className="shrink-0 text-[#000] font-inter text-sm w-[169px] text-right">
                            Card
                        </p>
                        <div className="flex justify-end items-center shrink-0 w-[113px]">
                            <div className="flex py-0 px-1.5 items-center gap-2 rounded-[10px] w-fit">
                                <svg
                                    width="14"
                                    height="14"
                                    viewBox="0 0 14 14"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="w-3.5 h-3.5 overflow-hidden relative "
                                >
                                    <path
                                        d="M12.25 8.75V11.0833C12.25 11.3928 12.1271 11.6895 11.9083 11.9083C11.6895 12.1271 11.3928 12.25 11.0833 12.25H2.91667C2.60725 12.25 2.3105 12.1271 2.09171 11.9083C1.87292 11.6895 1.75 11.3928 1.75 11.0833V8.75M9.91667 5.83333L7 8.75L4.08333 5.83333M7 8.75V1.75"
                                        stroke="#808080"
                                        strokeWidth="1.2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                </svg>
                            </div>
                            <div className="flex py-0 px-1.5 items-center gap-2 rounded-[10px] w-fit">
                                <svg
                                    width="14"
                                    height="14"
                                    viewBox="0 0 14 14"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="w-3.5 h-3.5 overflow-hidden relative "
                                >
                                    <path
                                        d="M4.08337 12.25C3.76254 12.25 3.48789 12.1358 3.25942 11.9073C3.03094 11.6788 2.91671 11.4042 2.91671 11.0833V3.5H2.33337V2.33333H5.25004V1.75H8.75004V2.33333H11.6667V3.5H11.0834V11.0833C11.0834 11.4042 10.9691 11.6788 10.7407 11.9073C10.5122 12.1358 10.2375 12.25 9.91671 12.25H4.08337ZM9.91671 3.5H4.08337V11.0833H9.91671V3.5ZM5.25004 9.91667H6.41671V4.66667H5.25004V9.91667ZM7.58337 9.91667H8.75004V4.66667H7.58337V9.91667Z"
                                        fill="#808080"
                                    />
                                </svg>
                            </div>
                        </div>
                    </div>
                    <div className="flex py-2 px-0 items-center w-[1133px]">
                        <div className="flex items-center gap-1.5 shrink-0 w-[539px]">
                            <svg
                                width="18"
                                height="18"
                                viewBox="0 0 18 18"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                                className="shrink-0 w-[18px] h-[18px] overflow-hidden relative "
                            >
                                <path
                                    d="M14.25 5.25C14.25 4.425 13.575 3.75 12.75 3.75H5.25C4.425 3.75 3.75 4.425 3.75 5.25V12.75C3.75 13.575 4.425 14.25 5.25 14.25H12.75C13.575 14.25 14.25 13.575 14.25 12.75V5.25ZM5.25 12.75V5.25H12.75V12.75H5.25Z"
                                    fill="black"
                                />
                            </svg>
                            <p className="text-[#000] font-inter text-sm w-fit">
                                S456RT789P1216
                            </p>
                        </div>
                        <div className="flex flex-col items-start gap-2.5 shrink-0 w-[87px]">
                            <button className="cursor-pointer text-nowrap flex py-1 px-2 justify-center items-center gap-2 rounded-[10px] bg-[#E5FFD8] w-fit">
                                <p className="text-[#808080] font-inter text-xs w-fit">
                                    Active
                                </p>
                                <div className="w-[7px] h-[7px]"></div>
                            </button>
                        </div>
                        <p className="shrink-0 text-[#000] font-inter text-sm w-[107px] text-right">
                            10&#x2F;02&#x2F;26
                        </p>
                        <p className="shrink-0 text-[#000] font-inter text-sm w-[98px] text-right">
                            INR 450
                        </p>
                        <p className="shrink-0 text-[#000] font-inter text-sm w-[169px] text-right">
                            Card
                        </p>
                        <div className="flex justify-end items-center shrink-0 w-[113px]">
                            <div className="flex py-0 px-1.5 items-center gap-2 rounded-[10px] w-fit">
                                <svg
                                    width="14"
                                    height="14"
                                    viewBox="0 0 14 14"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="w-3.5 h-3.5 overflow-hidden relative "
                                >
                                    <path
                                        d="M12.25 8.75V11.0833C12.25 11.3928 12.1271 11.6895 11.9083 11.9083C11.6895 12.1271 11.3928 12.25 11.0833 12.25H2.91667C2.60725 12.25 2.3105 12.1271 2.09171 11.9083C1.87292 11.6895 1.75 11.3928 1.75 11.0833V8.75M9.91667 5.83333L7 8.75L4.08333 5.83333M7 8.75V1.75"
                                        stroke="#808080"
                                        strokeWidth="1.2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                </svg>
                            </div>
                            <div className="flex py-0 px-1.5 items-center gap-2 rounded-[10px] w-fit">
                                <svg
                                    width="14"
                                    height="14"
                                    viewBox="0 0 14 14"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="w-3.5 h-3.5 overflow-hidden relative "
                                >
                                    <path
                                        d="M4.08337 12.25C3.76254 12.25 3.48789 12.1358 3.25942 11.9073C3.03094 11.6788 2.91671 11.4042 2.91671 11.0833V3.5H2.33337V2.33333H5.25004V1.75H8.75004V2.33333H11.6667V3.5H11.0834V11.0833C11.0834 11.4042 10.9691 11.6788 10.7407 11.9073C10.5122 12.1358 10.2375 12.25 9.91671 12.25H4.08337ZM9.91671 3.5H4.08337V11.0833H9.91671V3.5ZM5.25004 9.91667H6.41671V4.66667H5.25004V9.91667ZM7.58337 9.91667H8.75004V4.66667H7.58337V9.91667Z"
                                        fill="#808080"
                                    />
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
