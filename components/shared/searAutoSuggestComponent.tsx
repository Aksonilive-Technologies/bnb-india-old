"use client"

import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

const frameworks = [
  {
    value: "goa",
    label: "Goa",
  },
  {
    value: "mumbai",
    label: "Mumbai",
  },
  {
    value: "lonavla",
    label: "Lonavla",
  },
]

export function SearchAutoSuggestComponent() {
  const [open, setOpen] = React.useState(false)
  const [value, setValue] = React.useState("")

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild className="flex justify-center">
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full p-0 justify-between border-none bg-transparent"
        >
          {value
            ? frameworks.find((framework) => framework.value === value)?.label
            : "search destinations..."}
        </Button>
      </PopoverTrigger>
      <PopoverContent>
        <Command>
        <CommandList>
          <CommandInput placeholder="Search destinations..." />
          <CommandEmpty>Sorry! Location is not listed on bnbindia.</CommandEmpty>
          <CommandGroup />

            {frameworks.map((framework) => (
              <CommandItem
                key={framework.value}
                value={framework.value}
               
                className="text-gray-400"

                onSelect={() => {
                  setValue(framework.value)
                  setOpen(false)
                  // console.log(value + "selected by me")
                }}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    value === framework.value ? "opacity-100" : "opacity-0"
                  )}
                /> 
                    {framework.label}
  
                
              </CommandItem>
            ))}
            <CommandGroup />
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
