"use client";

import { Popover, PopoverButton, PopoverPanel } from "@headlessui/react";
import { Sparkles, Wand2, Lightbulb, Bot } from "lucide-react";
import clsx from "clsx";
const aiCommands = [
  {
    label: "/generate",
    description: "Auto-complete your thought with AI",
    icon: <Wand2 size={16} className="text-purple-500" />,
  },
  {
    label: "/suggest",
    description: "Get smart suggestions while typing",
    icon: <Lightbulb size={16} className="text-yellow-500" />,
  },
  {
    label: "topics",
    description: "AI will automatically suggest topics related to your comment",
    icon: <Bot size={16} className="text-blue-500 shrink-0" />,
  },
];
export default function AIOptions() {
  return (
    <Popover className="relative">
      {({ open }) => (
        <>
          <PopoverButton className="flex items-center gap-1 outline-none cursor-pointer">
            <Sparkles size={16} className="text-yellow-500" />
            <span className="text-[14px] font-medium tracking-tight text-gray-600">
              AI
            </span>
          </PopoverButton>

          <PopoverPanel
            className={clsx(
              "absolute z-20 mt-2 left-0 w-72 rounded-xl bg-white shadow-xl ring-1 ring-black/10",
              "transition ease-out duration-200 transform",
              open ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
            )}
          >
            <div className="px-2 py-3">
              <p className="text-sm text-gray-500 mb-2 font-medium">
                ✨ Enhance your thoughts with AI
              </p>
              <div className="flex flex-col gap-2">
                {aiCommands.map(({ label, description, icon }) => (
                  <button
                    key={label}
                    onClick={() => navigator.clipboard.writeText(label)}
                    className="flex items-start gap-2 text-left px-3 py-[6px] rounded-md hover:bg-gray-50 transition"
                  >
                    {icon}
                    <div>
                      <p className="text-sm font-medium text-gray-800">
                        {label}
                      </p>
                      <p className="text-xs text-gray-500">{description}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </PopoverPanel>
        </>
      )}
    </Popover>
  );
}
