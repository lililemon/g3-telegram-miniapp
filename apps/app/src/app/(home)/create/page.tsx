import { Button } from "@radix-ui/themes";
import { EpicItem } from "./EpicItem";

const Page = () => {
  return (
    <div>
      <div className="flex justify-center gap-2">
        <Button>Epic templates</Button>
        <Button color="gray" variant="outline">
          Created Epics
        </Button>
      </div>

      <div className="mt-4">
        <EpicItem />
      </div>
    </div>
  );
};

export default Page;
