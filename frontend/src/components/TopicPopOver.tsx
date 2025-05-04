"use client";

import { Popover, PopoverButton, PopoverPanel } from "@headlessui/react";
import { Sparkles, TrendingUp, Hash } from "lucide-react";
import clsx from "clsx";

export default function TopicOptions() {
  return (
    <Popover className="relative">
      {({ open }) => (
        <>
          <PopoverButton className="flex items-center gap-1 outline-none cursor-pointer">
            <Hash size={16} className="text-blue-400" />
            <span className="text-[14px] font-medium tracking-tight text-gray-600">
              Topic
            </span>
          </PopoverButton>

          <PopoverPanel
            className={clsx(
              "absolute z-20 mt-2 left-0 w-72 rounded-xl bg-white shadow-xl ring-1 ring-black/10",
              "transition ease-out duration-200 transform",
              open ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
            )}
          >
            <div className="px-4 py-3 ">
              <p className="text-sm text-gray-500 mb-2 font-medium flex items-center gap-2 justify-center">
                <TrendingUp className="text-blue-500" /> Make viral & trending
                Topics
              </p>
              <div className="text-gray-400 text-center">
                <p className="text-[12px]">
                  Your topics will be used to find related comments.
                </p>
                <p className="text-purple-500/60 text-[14px]">#Whispr</p>
              </div>
            </div>
          </PopoverPanel>
        </>
      )}
    </Popover>
  );
}
