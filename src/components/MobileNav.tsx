"use client";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import Image from "next/image";
import Link from "next/link";
import { sidebarLinks } from "../../constants";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const MobileNav = () => {
    const pathname = usePathname();
  return (
    <section className=" ">
      <Sheet>
        <SheetTrigger asChild>
          <Image
            src="/icons/hamburger.svg"
            alt="Menu"
            width={36}
            height={36}
            className="cursor-pointer sm:hidden"
          />
        </SheetTrigger>
        <SheetContent side={"left"} className="w-[264px] bg-dark-1 border-none">
          <Link href="/" className="flex items-center gap-1">
            <Image
              src="/icons/logo.svg"
              alt="Zoomkar Logo"
              width={32}
              height={32}
              className="max-sm:size-10"
            />
            <p className="text-[26px] text-white ">ZoomKar</p>
          </Link>
          <div className="flex h-[calc(100vh-72px)] flex-col justify-between overflow-auto">
            <SheetClose asChild>
              <section className="flex h-full flex-col gap-6 pt-16 text-white">
                {sidebarLinks.map((link) => {
                  const isActive =
                    pathname === link.route;
                  return (
                    <SheetClose asChild key={link.route}>
                    <Link
                      href={link.route}
                      key={link.label}
                      className={cn(
                        "flex gap-4 items-center p-4 rounded-lg w-full max-w-60",
                        { "bg-blue-1": isActive }
                      )}
                    >
                      <Image
                        src={link.ImageUrl}
                        alt={link.label}
                        width={20}
                        height={20}
                      />
                      <p className="text-lg font-semibold ">
                        {link.label}
                      </p>
                    </Link>
                    </SheetClose>
                  );
                })}
              </section>
            </SheetClose>
          </div>
        </SheetContent>
      </Sheet>
    </section>
  );
};

export default MobileNav;
