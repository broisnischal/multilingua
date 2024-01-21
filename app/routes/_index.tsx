import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { ActionFunctionArgs, MetaFunction } from "@remix-run/cloudflare";
import { Form, useActionData, useNavigation } from "@remix-run/react";

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

const languages = [
  {
    code: "af",
    name: "Afrikaans",
  },

  {
    code: "ne",
    name: "Nepali",
  },

  {
    code: "en",
    name: "English",
  },
  {
    code: "es",
    name: "Spanish",
  },
];

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();

  const text = formData.get("text");
  // const to = formData.get("to");

  const result = await Promise.all(
    languages.map(async (language) => {
      const data = await fetch(
        `https://t.song.work/api?text=${text}&from=en&to=${language.code}`
      ).then((res) => res.json());

      console.log(data);

      return {
        code: language.code,
        name: language.name,
        // checked: formData.get(language.code) === "on",
        result: data,
      };
    })
  );

  return result;
}

export default function Index() {
  const data = useActionData<typeof action>();

  const navigation = useNavigation();

  const isLoading = navigation.state === "submitting";

  console.log(data);

  return (
    <div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.8" }}>
      <div className="flex h-screen flex-col items-center justify-center w-2/3 mx-auto gap-2">
        <h1 className="text-3xl font-bold">MultiLingua</h1>
        <Form method="post" className="flex gap-2 items-center w-full">
          <Input
            name="text"
            id="text"
            placeholder="Enter whatever you want to convert..."
          />{" "}
          <input type="text" hidden value={"ne"} name="to" />
          <Button>{isLoading ? "Converting..." : "Convert"}</Button>
        </Form>
      </div>
    </div>
  );
}
