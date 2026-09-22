# Shadcn components

import { ArrowUpIcon } from "lucide-react"

import { Button } from "@/components/ui/button"

export function ButtonDemo() {
return (
<div className="flex flex-wrap items-center gap-2 md:flex-row">
<Button variant="outline">Button</Button>
<Button variant="outline" size="icon" aria-label="Submit">
<ArrowUpIcon />
</Button>
</div>
)
}

npx shadcn@latest add button

Tailwind v4 [**switched**](https://tailwindcss.com/docs/upgrade-guide#buttons-use-the-default-cursor) from `cursor: pointer` to `cursor: default` for the button component.

If you want to keep the `cursor: pointer` behavior, add the following code to your CSS file:

You can also enable this during project setup with `npx shadcn@latest init --pointer`.

globals.css

`Copy@layer base {  button:not(:disabled),  [role="button"]:not(:disabled) {    cursor: pointer;  }}`

import { Button } from "@/components/ui/button"

export function ButtonSecondary() {
return <Button variant="secondary">Secondary</Button>
}

import { Button } from "@/components/ui/button"

export function ButtonDestructive() {
return <Button variant="destructive">Destructive</Button>
}

import { Button } from "@/components/ui/button"

export function ButtonLink() {
return <Button variant="link">Link</Button>
}

import { ArrowUpIcon } from "lucide-react"

import { Button } from "@/components/ui/button"

export function ButtonRounded() {
return (
<div className="flex gap-2">
<Button className="rounded-full">Get Started</Button>
<Button variant="outline" size="icon" className="rounded-full">
<ArrowUpIcon />
</Button>
</div>
)
}

import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"

export function ButtonLoading() {
return (
<div className="flex gap-2">
<Button variant="outline" disabled>
<Spinner data-icon="inline-start" />
Generating
</Button>
<Button variant="secondary" disabled>
Downloading
<Spinner data-icon="inline-start" />
</Button>
</div>
)
}

Input

import {
Field,
FieldDescription,
FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"

export function InputDemo() {
return (
<Field>
<FieldLabel htmlFor="input-demo-api-key">API Key</FieldLabel>
<Input id="input-demo-api-key" type="password" placeholder="sk-..." />
<FieldDescription>
Your API key is encrypted and stored securely.
</FieldDescription>
</Field>
)
}

npx shadcn@latest add input

import { Input } from "@/components/ui/input"

export function InputBasic() {
return <Input placeholder="Enter text" />
}

import {
Field,
FieldDescription,
FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"

export function InputField() {
return (
<Field>
<FieldLabel htmlFor="input-field-username">Username</FieldLabel>
<Input
id="input-field-username"
type="text"
placeholder="Enter your username"
/>
<FieldDescription>
Choose a unique username for your account.
</FieldDescription>
</Field>
)
}

import { Button } from "@/components/ui/button"
import {
Field,
FieldDescription,
FieldGroup,
FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"

export function InputFieldgroup() {
return (
<FieldGroup>
<Field>
<FieldLabel htmlFor="fieldgroup-name">Name</FieldLabel>
<Input id="fieldgroup-name" placeholder="Jordan Lee" />
</Field>
<Field>
<FieldLabel htmlFor="fieldgroup-email">Email</FieldLabel>
<Input
id="fieldgroup-email"
type="email"
[placeholder="name@example.com](mailto:placeholder=%22name@example.com)"
/>
<FieldDescription>
We'll send updates to this address.
</FieldDescription>
</Field>
<Field orientation="horizontal">
<Button type="reset" variant="outline">
Reset
</Button>
<Button type="submit">Submit</Button>
</Field>
</FieldGroup>
)
}

import {
Field,
FieldDescription,
FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"

export function InputInvalid() {
return (
<Field data-invalid>
<FieldLabel htmlFor="input-invalid">Invalid Input</FieldLabel>
<Input id="input-invalid" placeholder="Error" aria-invalid />
<FieldDescription>
This field contains validation errors.
</FieldDescription>
</Field>
)
}

import {
Field,
FieldDescription,
FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"

export function InputFile() {
return (
<Field>
<FieldLabel htmlFor="picture">Picture</FieldLabel>
<Input id="picture" type="file" />
<FieldDescription>Select a picture to upload.</FieldDescription>
</Field>
)
}

import { Button } from "@/components/ui/button"
import { Field } from "@/components/ui/field"
import { Input } from "@/components/ui/input"

export function InputInline() {
return (
<Field orientation="horizontal">
<Input type="search" placeholder="Search..." />
<Button>Search</Button>
</Field>
)
}

import {
Field,
FieldDescription,
FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"

export function InputRequired() {
return (
<Field>
<FieldLabel htmlFor="input-required">
Required Field <span className="text-destructive">*</span>
</FieldLabel>
<Input
id="input-required"
placeholder="This field is required"
required
/>
<FieldDescription>This field must be filled out.</FieldDescription>
</Field>
)
}

import { Button } from "@/components/ui/button"
import { ButtonGroup } from "@/components/ui/button-group"
import { Field, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"

export function InputButtonGroup() {
return (
<Field>
<FieldLabel htmlFor="input-button-group">Search</FieldLabel>
<ButtonGroup>
<Input id="input-button-group" placeholder="Type to search..." />
<Button variant="outline">Search</Button>
</ButtonGroup>
</Field>
)
}

import { Button } from "@/components/ui/button"
import {
Field,
FieldDescription,
FieldGroup,
FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
Select,
SelectContent,
SelectGroup,
SelectItem,
SelectTrigger,
SelectValue,
} from "@/components/ui/select"

export function InputForm() {
const countries = [
{ label: "United States", value: "us" },
{ label: "United Kingdom", value: "uk" },
{ label: "Canada", value: "ca" },
]
return (
<form className="w-full max-w-sm">
<FieldGroup>
<Field>
<FieldLabel htmlFor="form-name">Name</FieldLabel>
<Input
id="form-name"
type="text"
placeholder="Evil Rabbit"
required
/>
</Field>
<Field>
<FieldLabel htmlFor="form-email">Email</FieldLabel>
<Input id="form-email" type="email" [placeholder="john@example.com](mailto:placeholder=%22john@example.com)" />
<FieldDescription>
We'll never share your email with anyone.
</FieldDescription>
</Field>
<div className="grid grid-cols-2 gap-4">
<Field>
<FieldLabel htmlFor="form-phone">Phone</FieldLabel>
<Input id="form-phone" type="tel" placeholder="+1 (555) 123-4567" />
</Field>
<Field>
<FieldLabel htmlFor="form-country">Country</FieldLabel>
<Select items={countries} defaultValue="us">
<SelectTrigger id="form-country">
<SelectValue />
</SelectTrigger>
<SelectContent>
<SelectGroup>
{countries.map((country) => (
<SelectItem key={country.value} value={country.value}>
{country.label}
</SelectItem>
))}
</SelectGroup>
</SelectContent>
</Select>
</Field>
</div>
<Field>
<FieldLabel htmlFor="form-address">Address</FieldLabel>
<Input id="form-address" type="text" placeholder="123 Main St" />
</Field>
<Field orientation="horizontal">
<Button type="button" variant="outline">
Cancel
</Button>
<Button type="submit">Submit</Button>
</Field>
</FieldGroup>
</form>
)
}

import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"

export function LabelDemo() {
return (
<div className="flex gap-2">
<Checkbox id="terms" />
<Label htmlFor="terms">Accept terms and conditions</Label>
</div>
)
}

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
Field,
FieldDescription,
FieldGroup,
FieldLabel,
FieldLegend,
FieldSeparator,
FieldSet,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
Select,
SelectContent,
SelectGroup,
SelectItem,
SelectTrigger,
SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"

const months = [
{ label: "MM", value: null },
{ label: "01", value: "01" },
{ label: "02", value: "02" },
{ label: "03", value: "03" },
{ label: "04", value: "04" },
{ label: "05", value: "05" },
{ label: "06", value: "06" },
{ label: "07", value: "07" },
{ label: "08", value: "08" },
{ label: "09", value: "09" },
{ label: "10", value: "10" },
{ label: "11", value: "11" },
{ label: "12", value: "12" },
]

const years = [
{ label: "YYYY", value: null },
{ label: "2024", value: "2024" },
{ label: "2025", value: "2025" },
{ label: "2026", value: "2026" },
{ label: "2027", value: "2027" },
{ label: "2028", value: "2028" },
{ label: "2029", value: "2029" },
]

export function FieldDemo() {
return (
<div className="w-full max-w-md">
<form>
<FieldGroup>
<FieldSet>
<FieldLegend>Payment Method</FieldLegend>
<FieldDescription>
All transactions are secure and encrypted
</FieldDescription>
<FieldGroup>
<Field>
<FieldLabel htmlFor="checkout-7j9-card-name-43j">
Name on Card
</FieldLabel>
<Input
id="checkout-7j9-card-name-43j"
placeholder="Evil Rabbit"
required
/>
</Field>
<Field>
<FieldLabel htmlFor="checkout-7j9-card-number-uw1">
Card Number
</FieldLabel>
<Input
id="checkout-7j9-card-number-uw1"
placeholder="1234 5678 9012 3456"
required
/>
<FieldDescription>
Enter your 16-digit card number
</FieldDescription>
</Field>
<div className="grid grid-cols-3 gap-4">
<Field>
<FieldLabel htmlFor="checkout-exp-month-ts6">
Month
</FieldLabel>
<Select items={months}>
<SelectTrigger id="checkout-exp-month-ts6">
<SelectValue />
</SelectTrigger>
<SelectContent>
<SelectGroup>
{months.map((item) => (
<SelectItem key={item.value} value={item.value}>
{item.label}
</SelectItem>
))}
</SelectGroup>
</SelectContent>
</Select>
</Field>
<Field>
<FieldLabel htmlFor="checkout-7j9-exp-year-f59">
Year
</FieldLabel>
<Select items={years}>
<SelectTrigger id="checkout-7j9-exp-year-f59">
<SelectValue />
</SelectTrigger>
<SelectContent>
<SelectGroup>
{years.map((item) => (
<SelectItem key={item.value} value={item.value}>
{item.label}
</SelectItem>
))}
</SelectGroup>
</SelectContent>
</Select>
</Field>
<Field>
<FieldLabel htmlFor="checkout-7j9-cvv">CVV</FieldLabel>
<Input id="checkout-7j9-cvv" placeholder="123" required />
</Field>
</div>
</FieldGroup>
</FieldSet>
<FieldSeparator />
<FieldSet>
<FieldLegend>Billing Address</FieldLegend>
<FieldDescription>
The billing address associated with your payment method
</FieldDescription>
<FieldGroup>
<Field orientation="horizontal">
<Checkbox
id="checkout-7j9-same-as-shipping-wgm"
defaultChecked
/>
<FieldLabel
htmlFor="checkout-7j9-same-as-shipping-wgm"
className="font-normal"
>
Same as shipping address
</FieldLabel>
</Field>
</FieldGroup>
</FieldSet>
<FieldSet>
<FieldGroup>
<Field>
<FieldLabel htmlFor="checkout-7j9-optional-comments">
Comments
</FieldLabel>
<Textarea
id="checkout-7j9-optional-comments"
placeholder="Add any additional comments"
className="resize-none"
/>
</Field>
</FieldGroup>
</FieldSet>
<Field orientation="horizontal">
<Button type="submit">Submit</Button>
<Button variant="outline" type="button">
Cancel
</Button>
</Field>
</FieldGroup>
</form>
</div>
)
}

import {
Select,
SelectContent,
SelectGroup,
SelectItem,
SelectLabel,
SelectTrigger,
SelectValue,
} from "@/components/ui/select"

const items = [
{ label: "Select a fruit", value: null },
{ label: "Apple", value: "apple" },
{ label: "Banana", value: "banana" },
{ label: "Blueberry", value: "blueberry" },
{ label: "Grapes", value: "grapes" },
{ label: "Pineapple", value: "pineapple" },
]

export function SelectDemo() {
return (
<Select items={items}>
<SelectTrigger className="w-full max-w-48">
<SelectValue />
</SelectTrigger>
<SelectContent>
<SelectGroup>
<SelectLabel>Fruits</SelectLabel>
{items.map((item) => (
<SelectItem key={item.value} value={item.value}>
{item.label}
</SelectItem>
))}
</SelectGroup>
</SelectContent>
</Select>
)
}

npx shadcn@latest add select

Select
├── SelectTrigger
│   └── SelectValue
└── SelectContent
├── SelectGroup
│   ├── SelectLabel
│   ├── SelectItem
│   └── SelectItem
├── SelectSeparator
└── SelectGroup
├── SelectLabel
├── SelectItem
└── SelectItem

import {
Select,
SelectContent,
SelectGroup,
SelectItem,
SelectLabel,
SelectTrigger,
SelectValue,
} from "@/components/ui/select"

const northAmerica = [
{ label: "Eastern Standard Time", value: "est" },
{ label: "Central Standard Time", value: "cst" },
{ label: "Mountain Standard Time", value: "mst" },
{ label: "Pacific Standard Time", value: "pst" },
{ label: "Alaska Standard Time", value: "akst" },
{ label: "Hawaii Standard Time", value: "hst" },
]

const europeAfrica = [
{ label: "Greenwich Mean Time", value: "gmt" },
{ label: "Central European Time", value: "cet" },
{ label: "Eastern European Time", value: "eet" },
{ label: "Western European Summer Time", value: "west" },
{ label: "Central Africa Time", value: "cat" },
{ label: "East Africa Time", value: "eat" },
]

const asia = [
{ label: "Moscow Time", value: "msk" },
{ label: "India Standard Time", value: "ist" },
{ label: "China Standard Time", value: "cst_china" },
{ label: "Japan Standard Time", value: "jst" },
{ label: "Korea Standard Time", value: "kst" },
{ label: "Indonesia Central Standard Time", value: "ist_indonesia" },
]

const australiaPacific = [
{ label: "Australian Western Standard Time", value: "awst" },
{ label: "Australian Central Standard Time", value: "acst" },
{ label: "Australian Eastern Standard Time", value: "aest" },
{ label: "New Zealand Standard Time", value: "nzst" },
{ label: "Fiji Time", value: "fjt" },
]

const southAmerica = [
{ label: "Argentina Time", value: "art" },
{ label: "Bolivia Time", value: "bot" },
{ label: "Brasilia Time", value: "brt" },
{ label: "Chile Standard Time", value: "clt" },
]

const items = [
{ label: "Select a timezone", value: null },
...northAmerica,
...europeAfrica,
...asia,
...australiaPacific,
...southAmerica,
]

export function SelectScrollable() {
return (
<Select items={items}>
<SelectTrigger className="w-full max-w-64">
<SelectValue />
</SelectTrigger>
<SelectContent>
<SelectGroup>
<SelectLabel>North America</SelectLabel>
{northAmerica.map((item) => (
<SelectItem key={item.value} value={item.value}>
{item.label}
</SelectItem>
))}
</SelectGroup>
<SelectGroup>
<SelectLabel>Europe & Africa</SelectLabel>
{europeAfrica.map((item) => (
<SelectItem key={item.value} value={item.value}>
{item.label}
</SelectItem>
))}
</SelectGroup>
<SelectGroup>
<SelectLabel>Asia</SelectLabel>
{asia.map((item) => (
<SelectItem key={item.value} value={item.value}>
{item.label}
</SelectItem>
))}
</SelectGroup>
<SelectGroup>
<SelectLabel>Australia & Pacific</SelectLabel>
{australiaPacific.map((item) => (
<SelectItem key={item.value} value={item.value}>
{item.label}
</SelectItem>
))}
</SelectGroup>
<SelectGroup>
<SelectLabel>South America</SelectLabel>
{southAmerica.map((item) => (
<SelectItem key={item.value} value={item.value}>
{item.label}
</SelectItem>
))}
</SelectGroup>
</SelectContent>
</Select>
)
}

<Field data-invalid>
<FieldLabel>Fruit</FieldLabel>
<SelectTrigger aria-invalid>
<SelectValue />
</SelectTrigger>
</Field>

import { Textarea } from "@/components/ui/textarea"

export function TextareaDemo() {
return <Textarea placeholder="Type your message here." />
}

import {
Field,
FieldDescription,
FieldLabel,
} from "@/components/ui/field"
import { Textarea } from "@/components/ui/textarea"

export function TextareaField() {
return (
<Field>
<FieldLabel htmlFor="textarea-message">Message</FieldLabel>
<FieldDescription>Enter your message below.</FieldDescription>
<Textarea id="textarea-message" placeholder="Type your message here." />
</Field>
)
}

import {
Field,
FieldDescription,
FieldLabel,
} from "@/components/ui/field"
import { Textarea } from "@/components/ui/textarea"

export function TextareaInvalid() {
return (
<Field data-invalid>
<FieldLabel htmlFor="textarea-invalid">Message</FieldLabel>
<Textarea
id="textarea-invalid"
placeholder="Type your message here."
aria-invalid
/>
<FieldDescription>Please enter a valid message.</FieldDescription>
</Field>
)
}

import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"

export function TextareaButton() {
return (
<div className="grid w-full gap-2">
<Textarea placeholder="Type your message here." />
<Button>Send message</Button>
</div>
)
}

"use client"

import { Checkbox } from "@/components/ui/checkbox"
import {
Field,
FieldContent,
FieldDescription,
FieldGroup,
FieldLabel,
FieldTitle,
} from "@/components/ui/field"
import { Label } from "@/components/ui/label"

export function CheckboxDemo() {
return (
<FieldGroup className="max-w-sm">
<Field orientation="horizontal">
<Checkbox id="terms-checkbox" name="terms-checkbox" />
<Label htmlFor="terms-checkbox">Accept terms and conditions</Label>
</Field>
<Field orientation="horizontal">
<Checkbox
id="terms-checkbox-2"
name="terms-checkbox-2"
defaultChecked
/>
<FieldContent>
<FieldLabel htmlFor="terms-checkbox-2">
Accept terms and conditions
</FieldLabel>
<FieldDescription>
By clicking this checkbox, you agree to the terms.
</FieldDescription>
</FieldContent>
</Field>
<Field orientation="horizontal" data-disabled>
<Checkbox id="toggle-checkbox" name="toggle-checkbox" disabled />
<FieldLabel htmlFor="toggle-checkbox">Enable notifications</FieldLabel>
</Field>
<FieldLabel>
<Field orientation="horizontal">
<Checkbox id="toggle-checkbox-2" name="toggle-checkbox-2" />
<FieldContent>
<FieldTitle>Enable notifications</FieldTitle>
<FieldDescription>
You can enable or disable notifications at any time.
</FieldDescription>
</FieldContent>
</Field>
</FieldLabel>
</FieldGroup>
)
}

npx shadcn@latest add checkbox

import * as React from "react"

export function Example() {
const [checked, setChecked] = React.useState(false)

return <Checkbox checked={checked} onCheckedChange={setChecked} />
}

import { Checkbox } from "@/components/ui/checkbox"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"

export function CheckboxInvalid() {
return (
<FieldGroup className="mx-auto w-56">
<Field orientation="horizontal" data-invalid>
<Checkbox
id="terms-checkbox-invalid"
name="terms-checkbox-invalid"
aria-invalid
/>
<FieldLabel htmlFor="terms-checkbox-invalid">
Accept terms and conditions
</FieldLabel>
</Field>
</FieldGroup>
)
}

import { Checkbox } from "@/components/ui/checkbox"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"

export function CheckboxBasic() {
return (
<FieldGroup className="mx-auto w-56">
<Field orientation="horizontal">
<Checkbox id="terms-checkbox-basic" name="terms-checkbox-basic" />
<FieldLabel htmlFor="terms-checkbox-basic">
Accept terms and conditions
</FieldLabel>
</Field>
</FieldGroup>
)
}

import { Checkbox } from "@/components/ui/checkbox"
import {
Field,
FieldContent,
FieldDescription,
FieldGroup,
FieldLabel,
} from "@/components/ui/field"

export function CheckboxDescription() {
return (
<FieldGroup className="mx-auto w-72">
<Field orientation="horizontal">
<Checkbox
id="terms-checkbox-desc"
name="terms-checkbox-desc"
defaultChecked
/>
<FieldContent>
<FieldLabel htmlFor="terms-checkbox-desc">
Accept terms and conditions
</FieldLabel>
<FieldDescription>
By clicking this checkbox, you agree to the terms and conditions.
</FieldDescription>
</FieldContent>
</Field>
</FieldGroup>
)
}

import {
Table,
TableBody,
TableCaption,
TableCell,
TableFooter,
TableHead,
TableHeader,
TableRow,
} from "@/components/ui/table"

const invoices = [
{
invoice: "INV001",
paymentStatus: "Paid",
totalAmount: "$250.00",
paymentMethod: "Credit Card",
},
{
invoice: "INV002",
paymentStatus: "Pending",
totalAmount: "$150.00",
paymentMethod: "PayPal",
},
{
invoice: "INV003",
paymentStatus: "Unpaid",
totalAmount: "$350.00",
paymentMethod: "Bank Transfer",
},
{
invoice: "INV004",
paymentStatus: "Paid",
totalAmount: "$450.00",
paymentMethod: "Credit Card",
},
{
invoice: "INV005",
paymentStatus: "Paid",
totalAmount: "$550.00",
paymentMethod: "PayPal",
},
{
invoice: "INV006",
paymentStatus: "Pending",
totalAmount: "$200.00",
paymentMethod: "Bank Transfer",
},
{
invoice: "INV007",
paymentStatus: "Unpaid",
totalAmount: "$300.00",
paymentMethod: "Credit Card",
},
]

export function TableDemo() {
return (
<Table>
<TableCaption>A list of your recent invoices.</TableCaption>
<TableHeader>
<TableRow>
<TableHead className="w-[100px]">Invoice</TableHead>
<TableHead>Status</TableHead>
<TableHead>Method</TableHead>
<TableHead className="text-right">Amount</TableHead>
</TableRow>
</TableHeader>
<TableBody>
{invoices.map((invoice) => (
<TableRow key={invoice.invoice}>
<TableCell className="font-medium">{invoice.invoice}</TableCell>
<TableCell>{invoice.paymentStatus}</TableCell>
<TableCell>{invoice.paymentMethod}</TableCell>
<TableCell className="text-right">{invoice.totalAmount}</TableCell>
</TableRow>
))}
</TableBody>
<TableFooter>
<TableRow>
<TableCell colSpan={3}>Total</TableCell>
<TableCell className="text-right">$2,500.00</TableCell>
</TableRow>
</TableFooter>
</Table>
)
}

npx shadcn@latest add table

Table
├── TableCaption
├── TableHeader
│   └── TableRow
│       ├── TableHead
│       ├── TableHead
│       ├── TableHead
│       └── TableHead
├── TableBody
│   ├── TableRow
│   │   ├── TableCell
│   │   ├── TableCell
│   │   ├── TableCell
│   │   └── TableCell
│   └── TableRow
│       ├── TableCell
│       ├── TableCell
│       ├── TableCell
│       └── TableCell
└── TableFooter

import {
Table,
TableBody,
TableCaption,
TableCell,
TableFooter,
TableHead,
TableHeader,
TableRow,
} from "@/components/ui/table"

const invoices = [
{
invoice: "INV001",
paymentStatus: "Paid",
totalAmount: "$250.00",
paymentMethod: "Credit Card",
},
{
invoice: "INV002",
paymentStatus: "Pending",
totalAmount: "$150.00",
paymentMethod: "PayPal",
},
{
invoice: "INV003",
paymentStatus: "Unpaid",
totalAmount: "$350.00",
paymentMethod: "Bank Transfer",
},
{
invoice: "INV004",
paymentStatus: "Paid",
totalAmount: "$450.00",
paymentMethod: "Credit Card",
},
{
invoice: "INV005",
paymentStatus: "Paid",
totalAmount: "$550.00",
paymentMethod: "PayPal",
},
{
invoice: "INV006",
paymentStatus: "Pending",
totalAmount: "$200.00",
paymentMethod: "Bank Transfer",
},
{
invoice: "INV007",
paymentStatus: "Unpaid",
totalAmount: "$300.00",
paymentMethod: "Credit Card",
},
]

export function TableFooterExample() {
return (
<Table>
<TableCaption>A list of your recent invoices.</TableCaption>
<TableHeader>
<TableRow>
<TableHead className="w-[100px]">Invoice</TableHead>
<TableHead>Status</TableHead>
<TableHead>Method</TableHead>
<TableHead className="text-right">Amount</TableHead>
</TableRow>
</TableHeader>
<TableBody>
{invoices.slice(0, 3).map((invoice) => (
<TableRow key={invoice.invoice}>
<TableCell className="font-medium">{invoice.invoice}</TableCell>
<TableCell>{invoice.paymentStatus}</TableCell>
<TableCell>{invoice.paymentMethod}</TableCell>
<TableCell className="text-right">{invoice.totalAmount}</TableCell>
</TableRow>
))}
</TableBody>
<TableFooter>
<TableRow>
<TableCell colSpan={3}>Total</TableCell>
<TableCell className="text-right">$2,500.00</TableCell>
</TableRow>
</TableFooter>
</Table>
)
}

import { MoreHorizontalIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
DropdownMenu,
DropdownMenuContent,
DropdownMenuItem,
DropdownMenuSeparator,
DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
Table,
TableBody,
TableCell,
TableHead,
TableHeader,
TableRow,
} from "@/components/ui/table"

export function TableActions() {
return (
<Table>
<TableHeader>
<TableRow>
<TableHead>Product</TableHead>
<TableHead>Price</TableHead>
<TableHead className="text-right">Actions</TableHead>
</TableRow>
</TableHeader>
<TableBody>
<TableRow>
<TableCell className="font-medium">Wireless Mouse</TableCell>
<TableCell>$29.99</TableCell>
<TableCell className="text-right">
<DropdownMenu>
<DropdownMenuTrigger render={<Button variant="ghost" size="icon" className="size-8"><MoreHorizontalIcon /><span className="sr-only">Open menu</span></Button>} />
<DropdownMenuContent align="end">
<DropdownMenuItem>Edit</DropdownMenuItem>
<DropdownMenuItem>Duplicate</DropdownMenuItem>
<DropdownMenuSeparator />
<DropdownMenuItem variant="destructive">
Delete
</DropdownMenuItem>
</DropdownMenuContent>
</DropdownMenu>
</TableCell>
</TableRow>
<TableRow>
<TableCell className="font-medium">Mechanical Keyboard</TableCell>
<TableCell>$129.99</TableCell>
<TableCell className="text-right">
<DropdownMenu>
<DropdownMenuTrigger render={<Button variant="ghost" size="icon" className="size-8"><MoreHorizontalIcon /><span className="sr-only">Open menu</span></Button>} />
<DropdownMenuContent align="end">
<DropdownMenuItem>Edit</DropdownMenuItem>
<DropdownMenuItem>Duplicate</DropdownMenuItem>
<DropdownMenuSeparator />
<DropdownMenuItem variant="destructive">
Delete
</DropdownMenuItem>
</DropdownMenuContent>
</DropdownMenu>
</TableCell>
</TableRow>
<TableRow>
<TableCell className="font-medium">USB-C Hub</TableCell>
<TableCell>$49.99</TableCell>
<TableCell className="text-right">
<DropdownMenu>
<DropdownMenuTrigger render={<Button variant="ghost" size="icon" className="size-8"><MoreHorizontalIcon /><span className="sr-only">Open menu</span></Button>} />
<DropdownMenuContent align="end">
<DropdownMenuItem>Edit</DropdownMenuItem>
<DropdownMenuItem>Duplicate</DropdownMenuItem>
<DropdownMenuSeparator />
<DropdownMenuItem variant="destructive">
Delete
</DropdownMenuItem>
</DropdownMenuContent>
</DropdownMenu>
</TableCell>
</TableRow>
</TableBody>
</Table>
)
}

import { Button } from "@/components/ui/button"
import {
Card,
CardAction,
CardContent,
CardDescription,
CardFooter,
CardHeader,
CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function CardDemo() {
return (
<Card className="w-full max-w-sm">
<CardHeader>
<CardTitle>Login to your account</CardTitle>
<CardDescription>
Enter your email below to login to your account
</CardDescription>
<CardAction>
<Button variant="link">Sign Up</Button>
</CardAction>
</CardHeader>
<CardContent>
<form>
<div className="flex flex-col gap-6">
<div className="grid gap-2">
<Label htmlFor="email">Email</Label>
<Input
id="email"
type="email"
[placeholder="m@example.com](mailto:placeholder=%22m@example.com)"
required
/>
</div>
<div className="grid gap-2">
<div className="flex items-center">
<Label htmlFor="password">Password</Label>
<a
href="#"
className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
>
Forgot your password?
</a>
</div>
<Input id="password" type="password" required />
</div>
</div>
</form>
</CardContent>
<CardFooter className="flex-col gap-2">
<Button type="submit" className="w-full">
Login
</Button>
<Button variant="outline" className="w-full">
Login with Google
</Button>
</CardFooter>
</Card>
)
}

npx shadcn@latest add card

Card
├── CardHeader
│   ├── CardTitle
│   ├── CardDescription
│   └── CardAction
├── CardContent
└── CardFooter

import { ChevronRightIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
Card,
CardContent,
CardDescription,
CardFooter,
CardHeader,
CardTitle,
} from "@/components/ui/card"

export function CardSmall() {
const featureName = "Scheduled reports"

return (
<Card size="sm" className="mx-auto w-full max-w-xs">
<CardHeader>
<CardTitle>{featureName}</CardTitle>
<CardDescription>
Weekly snapshots. No more manual exports.
</CardDescription>
</CardHeader>
<CardContent>
<ul className="grid gap-2 py-2 text-sm">
<li className="flex gap-2">
<ChevronRightIcon className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
<span>Choose a schedule (daily, or weekly).</span>
</li>
<li className="flex gap-2">
<ChevronRightIcon className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
<span>Send to channels or specific teammates.</span>
</li>
<li className="flex gap-2">
<ChevronRightIcon className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
<span>Include charts, tables, and key metrics.</span>
</li>
</ul>
</CardContent>
<CardFooter className="flex-col gap-2">
<Button size="sm" className="w-full">
Set up scheduled reports
</Button>
<Button variant="outline" size="sm" className="w-full">
See what's new
</Button>
</CardFooter>
</Card>
)
}

"use client"

import * as React from "react"

import { Button } from "@/components/ui/button"
import {
Card,
CardAction,
CardContent,
CardDescription,
CardFooter,
CardHeader,
CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
ToggleGroup,
ToggleGroupItem,
} from "@/components/ui/toggle-group"

const spacingOptions = [
{
className: "[--card-spacing:--spacing(4)]",
label: "16px",
value: "4",
},
{
className: "[--card-spacing:--spacing(5)]",
label: "20px",
value: "5",
},
{
className: "[--card-spacing:--spacing(6)]",
label: "24px",
value: "6",
},
{
className: "[--card-spacing:--spacing(8)]",
label: "32px",
value: "8",
},
]

export function CardSpacing() {
const [spacing, setSpacing] = React.useState("4")
const selectedSpacing = spacingOptions.find(
(option) => option.value === spacing
)

return (
<div className="mx-auto grid w-full max-w-sm gap-4">
<ToggleGroup
value={[spacing]}
onValueChange={(value) => {
if (value[0]) {
setSpacing(value[0])
}
}}
variant="outline"
size="sm"
className="justify-center"
>
{spacingOptions.map((option) => (
<ToggleGroupItem key={option.value} value={option.value}>
{option.label}
</ToggleGroupItem>
))}
</ToggleGroup>
<Card className={selectedSpacing?.className}>
<CardHeader>
<CardTitle>Login to your account</CardTitle>
<CardDescription>
Enter your email below to login to your account
</CardDescription>
<CardAction>
<Button variant="link">Sign Up</Button>
</CardAction>
</CardHeader>
<CardContent>
<form>
<div className="flex flex-col gap-6">
<div className="grid gap-2">
<Label htmlFor="email-spacing">Email</Label>
<Input
id="email-spacing"
type="email"
[placeholder="m@example.com](mailto:placeholder=%22m@example.com)"
required
/>
</div>
<div className="grid gap-2">
<div className="flex items-center">
<Label htmlFor="password-spacing">Password</Label>
<a
href="#"
className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
>
Forgot your password?
</a>
</div>
<Input id="password-spacing" type="password" required />
</div>
</div>
</form>
</CardContent>
<CardFooter className="flex-col gap-2">
<Button type="submit" className="w-full">
Login
</Button>
<Button variant="outline" className="w-full">
Login with Google
</Button>
</CardFooter>
</Card>
</div>
)
}

import { Button } from "@/components/ui/button"
import {
Card,
CardContent,
CardDescription,
CardFooter,
CardHeader,
CardTitle,
} from "@/components/ui/card"

export function CardEdgeToEdge() {
return (
<Card className="mx-auto w-full max-w-sm">
<CardHeader>
<CardTitle>Terms of Service</CardTitle>
<CardDescription>
Review the terms before accepting the agreement.
</CardDescription>
</CardHeader>
<CardContent className="-mb-(--card-spacing)">
<div className="-mx-(--card-spacing) max-h-48 space-y-4 overflow-y-scroll border-t bg-muted/50 px-(--card-spacing) py-4 text-sm leading-relaxed">
<p>
These terms govern your use of the workspace, including access to
shared documents, project files, and collaboration tools.
</p>
<p>
You are responsible for the content you upload and for ensuring that
your team has the appropriate permissions to view or edit it.
</p>
<p>
We may update features or limits as the service evolves. When those
changes materially affect your workflow, we will notify your
workspace administrators.
</p>
<p>
By continuing, you agree to keep your account credentials secure and
to follow your organization's acceptable use policies.
</p>
</div>
</CardContent>
<CardFooter className="justify-end gap-2">
<Button variant="outline">Decline</Button>
<Button>Accept</Button>
</CardFooter>
</Card>
)
}

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
Card,
CardAction,
CardDescription,
CardFooter,
CardHeader,
CardTitle,
} from "@/components/ui/card"

export function CardImage() {
return (
<Card className="relative mx-auto w-full max-w-sm pt-0">
<div className="absolute inset-0 z-30 aspect-video bg-black/35" />
<img
src="[https://avatar.vercel.sh/shadcn1](https://avatar.vercel.sh/shadcn1)"
alt="Event cover"
className="relative z-20 aspect-video w-full object-cover brightness-60 grayscale dark:brightness-40"
/>
<CardHeader>
<CardAction>
<Badge variant="secondary">Featured</Badge>
</CardAction>
<CardTitle>Design systems meetup</CardTitle>
<CardDescription>
A practical talk on component APIs, accessibility, and shipping
faster.
</CardDescription>
</CardHeader>
<CardFooter>
<Button className="w-full">View Event</Button>
</CardFooter>
</Card>
)
}

import { Badge } from "@/components/ui/badge"

export function BadgeDemo() {
return (
<div className="flex w-full flex-wrap justify-center gap-2">
<Badge>Badge</Badge>
<Badge variant="secondary">Secondary</Badge>
<Badge variant="destructive">Destructive</Badge>
<Badge variant="outline">Outline</Badge>
</div>
)
}

npx shadcn@latest add badge

import { Badge } from "@/components/ui/badge"

export function BadgeVariants() {
return (
<div className="flex flex-wrap gap-2">
<Badge>Default</Badge>
<Badge variant="secondary">Secondary</Badge>
<Badge variant="destructive">Destructive</Badge>
<Badge variant="outline">Outline</Badge>
<Badge variant="ghost">Ghost</Badge>
</div>
)
}

import { BadgeCheck, BookmarkIcon } from "lucide-react"

import { Badge } from "@/components/ui/badge"

export function BadgeWithIconLeft() {
return (
<div className="flex flex-wrap gap-2">
<Badge variant="secondary">
<BadgeCheck data-icon="inline-start" />
Verified
</Badge>
<Badge variant="outline">
Bookmark
<BookmarkIcon data-icon="inline-end" />
</Badge>
</div>
)
}

import { Badge } from "@/components/ui/badge"
import { Spinner } from "@/components/ui/spinner"

export function BadgeWithSpinner() {
return (
<div className="flex flex-wrap gap-2">
<Badge variant="destructive">
<Spinner data-icon="inline-start" />
Deleting
</Badge>
<Badge variant="secondary">
Generating
<Spinner data-icon="inline-end" />
</Badge>
</div>
)
}

import { ArrowUpRightIcon } from "lucide-react"

import { Badge } from "@/components/ui/badge"

export function BadgeAsLink() {
return (
<Badge render={<a href="#link">Open Link <ArrowUpRightIcon data-icon="inline-end" /></a>} />
)
}

import { Badge } from "@/components/ui/badge"

export function BadgeCustomColors() {
return (
<div className="flex flex-wrap gap-2">
<Badge className="bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300">
Blue
</Badge>
<Badge className="bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300">
Green
</Badge>
<Badge className="bg-sky-50 text-sky-700 dark:bg-sky-950 dark:text-sky-300">
Sky
</Badge>
<Badge className="bg-purple-50 text-purple-700 dark:bg-purple-950 dark:text-purple-300">
Purple
</Badge>
<Badge className="bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300">
Red
</Badge>
</div>
)
}

import {
Avatar,
AvatarBadge,
AvatarFallback,
AvatarGroup,
AvatarGroupCount,
AvatarImage,
} from "@/components/ui/avatar"

export function AvatarDemo() {
return (
<div className="flex flex-row flex-wrap items-center gap-6 md:gap-12">
<Avatar>
<AvatarImage
src="[https://github.com/shadcn.png](https://github.com/shadcn.png)"
alt="@shadcn"
className="grayscale"
/>
<AvatarFallback>CN</AvatarFallback>
</Avatar>
<Avatar>
<AvatarImage
src="[https://github.com/evilrabbit.png](https://github.com/evilrabbit.png)"
alt="@evilrabbit"
/>
<AvatarFallback>ER</AvatarFallback>
<AvatarBadge className="bg-green-600 dark:bg-green-800" />
</Avatar>
<AvatarGroup className="grayscale">
<Avatar>
<AvatarImage src="[https://github.com/shadcn.png](https://github.com/shadcn.png)" alt="@shadcn" />
<AvatarFallback>CN</AvatarFallback>
</Avatar>
<Avatar>
<AvatarImage
src="[https://github.com/maxleiter.png](https://github.com/maxleiter.png)"
alt="@maxleiter"
/>
<AvatarFallback>LR</AvatarFallback>
</Avatar>
<Avatar>
<AvatarImage
src="[https://github.com/evilrabbit.png](https://github.com/evilrabbit.png)"
alt="@evilrabbit"
/>
<AvatarFallback>ER</AvatarFallback>
</Avatar>
<AvatarGroupCount>+3</AvatarGroupCount>
</AvatarGroup>
</div>
)
}

npx shadcn@latest add avatar

Avatar
├── AvatarImage
├── AvatarFallback
└── AvatarBadge

AvatarGroup
├── Avatar
│   ├── AvatarImage
│   ├── AvatarFallback
│   └── AvatarBadge
├── Avatar
│   ├── AvatarImage
│   ├── AvatarFallback
│   └── AvatarBadge
└── AvatarGroupCount

import {
Avatar,
AvatarFallback,
AvatarImage,
} from "@/components/ui/avatar"

export function AvatarDemo() {
return (
<Avatar>
<AvatarImage
src="[https://github.com/shadcn.png](https://github.com/shadcn.png)"
alt="@shadcn"
className="grayscale"
/>
<AvatarFallback>CN</AvatarFallback>
</Avatar>
)
}

import {
Avatar,
AvatarBadge,
AvatarFallback,
AvatarImage,
} from "@/components/ui/avatar"

export function AvatarWithBadge() {
return (
<Avatar>
<AvatarImage src="[https://github.com/shadcn.png](https://github.com/shadcn.png)" alt="@shadcn" />
<AvatarFallback>CN</AvatarFallback>
<AvatarBadge className="bg-green-600 dark:bg-green-800" />
</Avatar>
)
}

import { PlusIcon } from "lucide-react"

import {
Avatar,
AvatarBadge,
AvatarFallback,
AvatarImage,
} from "@/components/ui/avatar"

export function AvatarBadgeIconExample() {
return (
<Avatar className="grayscale">
<AvatarImage src="[https://github.com/pranathip.png](https://github.com/pranathip.png)" alt="@pranathip" />
<AvatarFallback>PP</AvatarFallback>
<AvatarBadge>
<PlusIcon />
</AvatarBadge>
</Avatar>
)
}

import {
Avatar,
AvatarFallback,
AvatarImage,
} from "@/components/ui/avatar"

export function AvatarSizeExample() {
return (
<div className="flex flex-wrap items-center gap-2 grayscale">
<Avatar size="sm">
<AvatarImage src="[https://github.com/shadcn.png](https://github.com/shadcn.png)" alt="@shadcn" />
<AvatarFallback>CN</AvatarFallback>
</Avatar>
<Avatar>
<AvatarImage src="[https://github.com/shadcn.png](https://github.com/shadcn.png)" alt="@shadcn" />
<AvatarFallback>CN</AvatarFallback>
</Avatar>
<Avatar size="lg">
<AvatarImage src="[https://github.com/shadcn.png](https://github.com/shadcn.png)" alt="@shadcn" />
<AvatarFallback>CN</AvatarFallback>
</Avatar>
</div>
)
}

"use client"

import {
Avatar,
AvatarFallback,
AvatarImage,
} from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
DropdownMenu,
DropdownMenuContent,
DropdownMenuGroup,
DropdownMenuItem,
DropdownMenuSeparator,
DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function AvatarDropdown() {
return (
<DropdownMenu>
<DropdownMenuTrigger render={<Button variant="ghost" size="icon" className="rounded-full"><Avatar>
<AvatarImage src="[https://github.com/shadcn.png](https://github.com/shadcn.png)" alt="shadcn" />
<AvatarFallback>CN</AvatarFallback>
</Avatar></Button>} />
<DropdownMenuContent className="w-32">
<DropdownMenuGroup>
<DropdownMenuItem>Profile</DropdownMenuItem>
<DropdownMenuItem>Billing</DropdownMenuItem>
<DropdownMenuItem>Settings</DropdownMenuItem>
</DropdownMenuGroup>
<DropdownMenuSeparator />
<DropdownMenuGroup>
<DropdownMenuItem variant="destructive">Log out</DropdownMenuItem>
</DropdownMenuGroup>
</DropdownMenuContent>
</DropdownMenu>
)
}

import { Button } from "@/components/ui/button"
import {
Tooltip,
TooltipContent,
TooltipTrigger,
} from "@/components/ui/tooltip"

export function TooltipDemo() {
return (
<Tooltip>
<TooltipTrigger render={<Button variant="outline">Hover</Button>} />
<TooltipContent>
<p>Add to library</p>
</TooltipContent>
</Tooltip>
)
}

npx shadcn@latest add tooltip

Tooltip
├── TooltipTrigger
└── TooltipContent

import { Button } from "@/components/ui/button"
import {
Tooltip,
TooltipContent,
TooltipTrigger,
} from "@/components/ui/tooltip"

export function TooltipSides() {
return (
<div className="flex flex-wrap gap-2">
{(["left", "top", "bottom", "right"] as const).map((side) => (
<Tooltip key={side}>
<TooltipTrigger render={<Button variant="outline" className="w-fit capitalize">{side}</Button>} />
<TooltipContent side={side}>
<p>Add to library</p>
</TooltipContent>
</Tooltip>
))}
</div>
)
}

import { SaveIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Kbd } from "@/components/ui/kbd"
import {
Tooltip,
TooltipContent,
TooltipTrigger,
} from "@/components/ui/tooltip"

export function TooltipKeyboard() {
return (
<Tooltip>
<TooltipTrigger render={<Button variant="outline" size="icon-sm"><SaveIcon /></Button>} />
<TooltipContent>
Save Changes <Kbd>S</Kbd>
</TooltipContent>
</Tooltip>
)
}

import { Button } from "@/components/ui/button"
import {
Dialog,
DialogClose,
DialogContent,
DialogDescription,
DialogFooter,
DialogHeader,
DialogTitle,
DialogTrigger,
} from "@/components/ui/dialog"
import { Field, FieldGroup } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function DialogDemo() {
return (
<Dialog>
<form>
<DialogTrigger render={<Button variant="outline">Open Dialog</Button>} />
<DialogContent className="sm:max-w-sm">
<DialogHeader>
<DialogTitle>Edit profile</DialogTitle>
<DialogDescription>
Make changes to your profile here. Click save when you're
done.
</DialogDescription>
</DialogHeader>
<FieldGroup>
<Field>
<Label htmlFor="name-1">Name</Label>
<Input id="name-1" name="name" defaultValue="Pedro Duarte" />
</Field>
<Field>
<Label htmlFor="username-1">Username</Label>
<Input id="username-1" name="username" defaultValue="@peduarte" />
</Field>
</FieldGroup>
<DialogFooter>
<DialogClose render={<Button variant="outline">Cancel</Button>} />
<Button type="submit">Save changes</Button>
</DialogFooter>
</DialogContent>
</form>
</Dialog>
)
}

Dialog
├── DialogTrigger
└── DialogContent
├── DialogHeader
│   ├── DialogTitle
│   └── DialogDescription
└── DialogFooter

import { Button } from "@/components/ui/button"
import {
Dialog,
DialogClose,
DialogContent,
DialogDescription,
DialogFooter,
DialogHeader,
DialogTitle,
DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function DialogCloseButton() {
return (
<Dialog>
<DialogTrigger render={<Button variant="outline">Share</Button>} />
<DialogContent className="sm:max-w-md">
<DialogHeader>
<DialogTitle>Share link</DialogTitle>
<DialogDescription>
Anyone who has this link will be able to view this.
</DialogDescription>
</DialogHeader>
<div className="flex items-center gap-2">
<div className="grid flex-1 gap-2">
<Label htmlFor="link" className="sr-only">
Link
</Label>
<Input
id="link"
defaultValue="[https://ui.shadcn.com/docs/installation](https://ui.shadcn.com/docs/installation)"
readOnly
/>
</div>
</div>
<DialogFooter className="sm:justify-start">
<DialogClose render={<Button type="button">Close</Button>} />
</DialogFooter>
</DialogContent>
</Dialog>
)
}

import { Button } from "@/components/ui/button"
import {
Dialog,
DialogClose,
DialogContent,
DialogDescription,
DialogFooter,
DialogHeader,
DialogTitle,
DialogTrigger,
} from "@/components/ui/dialog"

export function DialogNoCloseButton() {
return (
<Dialog>
<DialogTrigger render={<Button variant="outline">No Close Button</Button>} />
<DialogContent showCloseButton={false}>
<DialogHeader>
<DialogTitle>No Close Button</DialogTitle>
<DialogDescription>
This dialog doesn't have a close button in the top-right
corner.
</DialogDescription>
</DialogHeader>
</DialogContent>
</Dialog>
)
}

import { Button } from "@/components/ui/button"
import {
Dialog,
DialogClose,
DialogContent,
DialogDescription,
DialogFooter,
DialogHeader,
DialogTitle,
DialogTrigger,
} from "@/components/ui/dialog"

export function DialogStickyFooter() {
return (
<Dialog>
<DialogTrigger render={<Button variant="outline">Sticky Footer</Button>} />
<DialogContent>
<DialogHeader>
<DialogTitle>Sticky Footer</DialogTitle>
<DialogDescription>
This dialog has a sticky footer that stays visible while the content
scrolls.
</DialogDescription>
</DialogHeader>
<div className="-mx-4 no-scrollbar max-h-[50vh] overflow-y-auto px-4">
{Array.from({ length: 10 }).map((_, index) => (
<p key={index} className="mb-4 leading-normal">
Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
enim ad minim veniam, quis nostrud exercitation ullamco laboris
nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in
reprehenderit in voluptate velit esse cillum dolore eu fugiat
nulla pariatur. Excepteur sint occaecat cupidatat non proident,
sunt in culpa qui officia deserunt mollit anim id est laborum.
</p>
))}
</div>
<DialogFooter>
<DialogClose render={<Button variant="outline">Close</Button>} />
</DialogFooter>
</DialogContent>
</Dialog>
)
}

import { Button } from "@/components/ui/button"
import {
Dialog,
DialogContent,
DialogDescription,
DialogHeader,
DialogTitle,
DialogTrigger,
} from "@/components/ui/dialog"

export function DialogScrollableContent() {
return (
<Dialog>
<DialogTrigger render={<Button variant="outline">Scrollable Content</Button>} />
<DialogContent>
<DialogHeader>
<DialogTitle>Scrollable Content</DialogTitle>
<DialogDescription>
This is a dialog with scrollable content.
</DialogDescription>
</DialogHeader>
<div className="-mx-4 no-scrollbar max-h-[50vh] overflow-y-auto px-4">
{Array.from({ length: 10 }).map((_, index) => (
<p key={index} className="mb-4 leading-normal">
Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
enim ad minim veniam, quis nostrud exercitation ullamco laboris
nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in
reprehenderit in voluptate velit esse cillum dolore eu fugiat
nulla pariatur. Excepteur sint occaecat cupidatat non proident,
sunt in culpa qui officia deserunt mollit anim id est laborum.
</p>
))}
</div>
</DialogContent>
</Dialog>
)
}

import {
AlertDialog,
AlertDialogAction,
AlertDialogCancel,
AlertDialogContent,
AlertDialogDescription,
AlertDialogFooter,
AlertDialogHeader,
AlertDialogTitle,
AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"

export function AlertDialogDemo() {
return (
<AlertDialog>
<AlertDialogTrigger render={<Button variant="outline">Show Dialog</Button>} />
<AlertDialogContent>
<AlertDialogHeader>
<AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
<AlertDialogDescription>
This action cannot be undone. This will permanently delete your
account from our servers.
</AlertDialogDescription>
</AlertDialogHeader>
<AlertDialogFooter>
<AlertDialogCancel>Cancel</AlertDialogCancel>
<AlertDialogAction>Continue</AlertDialogAction>
</AlertDialogFooter>
</AlertDialogContent>
</AlertDialog>
)
}

AlertDialog
├── AlertDialogTrigger
└── AlertDialogContent
├── AlertDialogHeader
│   ├── AlertDialogMedia
│   ├── AlertDialogTitle
│   └── AlertDialogDescription
└── AlertDialogFooter
├── AlertDialogCancel
└── AlertDialogAction

import {
AlertDialog,
AlertDialogAction,
AlertDialogCancel,
AlertDialogContent,
AlertDialogDescription,
AlertDialogFooter,
AlertDialogHeader,
AlertDialogTitle,
AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"

export function AlertDialogBasic() {
return (
<AlertDialog>
<AlertDialogTrigger
render={<Button variant="outline">Show Dialog</Button>}
/>
<AlertDialogContent>
<AlertDialogHeader>
<AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
<AlertDialogDescription>
This action cannot be undone. This will permanently delete your
account and remove your data from our servers.
</AlertDialogDescription>
</AlertDialogHeader>
<AlertDialogFooter>
<AlertDialogCancel>Cancel</AlertDialogCancel>
<AlertDialogAction>Continue</AlertDialogAction>
</AlertDialogFooter>
</AlertDialogContent>
</AlertDialog>
)
}

import { Trash2Icon } from "lucide-react"

import {
AlertDialog,
AlertDialogAction,
AlertDialogCancel,
AlertDialogContent,
AlertDialogDescription,
AlertDialogFooter,
AlertDialogHeader,
AlertDialogMedia,
AlertDialogTitle,
AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"

export function AlertDialogDestructive() {
return (
<AlertDialog>
<AlertDialogTrigger
render={<Button variant="destructive">Delete Chat</Button>}
/>
<AlertDialogContent size="sm">
<AlertDialogHeader>
<AlertDialogMedia className="bg-destructive/10 text-destructive dark:bg-destructive/20 dark:text-destructive">
<Trash2Icon />
</AlertDialogMedia>
<AlertDialogTitle>Delete chat?</AlertDialogTitle>
<AlertDialogDescription>
This will permanently delete this chat conversation. View{" "}
<a href="#">Settings</a> delete any memories saved during this chat.
</AlertDialogDescription>
</AlertDialogHeader>
<AlertDialogFooter>
<AlertDialogCancel variant="outline">Cancel</AlertDialogCancel>
<AlertDialogAction variant="destructive">Delete</AlertDialogAction>
</AlertDialogFooter>
</AlertDialogContent>
</AlertDialog>
)
}

"use client"

import { Button } from "@/components/ui/button"
import {
DropdownMenu,
DropdownMenuContent,
DropdownMenuGroup,
DropdownMenuItem,
DropdownMenuLabel,
DropdownMenuPortal,
DropdownMenuSeparator,
DropdownMenuShortcut,
DropdownMenuSub,
DropdownMenuSubContent,
DropdownMenuSubTrigger,
DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function DropdownMenuDemo() {
return (
<DropdownMenu>
<DropdownMenuTrigger render={<Button variant="outline">Open</Button>} />
<DropdownMenuContent className="w-40" align="start">
<DropdownMenuGroup>
<DropdownMenuLabel>My Account</DropdownMenuLabel>
<DropdownMenuItem>
Profile
<DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
</DropdownMenuItem>
<DropdownMenuItem>
Billing
<DropdownMenuShortcut>⌘B</DropdownMenuShortcut>
</DropdownMenuItem>
<DropdownMenuItem>
Settings
<DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
</DropdownMenuItem>
</DropdownMenuGroup>
<DropdownMenuSeparator />
<DropdownMenuGroup>
<DropdownMenuItem>Team</DropdownMenuItem>
<DropdownMenuSub>
<DropdownMenuSubTrigger>Invite users</DropdownMenuSubTrigger>
<DropdownMenuPortal>
<DropdownMenuSubContent>
<DropdownMenuItem>Email</DropdownMenuItem>
<DropdownMenuItem>Message</DropdownMenuItem>
<DropdownMenuSeparator />
<DropdownMenuItem>More...</DropdownMenuItem>
</DropdownMenuSubContent>
</DropdownMenuPortal>
</DropdownMenuSub>
<DropdownMenuItem>
New Team
<DropdownMenuShortcut>⌘+T</DropdownMenuShortcut>
</DropdownMenuItem>
</DropdownMenuGroup>
<DropdownMenuSeparator />
<DropdownMenuGroup>
<DropdownMenuItem>GitHub</DropdownMenuItem>
<DropdownMenuItem>Support</DropdownMenuItem>
<DropdownMenuItem disabled>API</DropdownMenuItem>
</DropdownMenuGroup>
<DropdownMenuSeparator />
<DropdownMenuGroup>
<DropdownMenuItem>
Log out
<DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
</DropdownMenuItem>
</DropdownMenuGroup>
</DropdownMenuContent>
</DropdownMenu>
)
}

DropdownMenu
├── DropdownMenuTrigger
└── DropdownMenuContent
├── DropdownMenuGroup
│   ├── DropdownMenuLabel
│   ├── DropdownMenuItem
│   └── DropdownMenuItem
├── DropdownMenuSeparator
├── DropdownMenuGroup
│   ├── DropdownMenuLabel
│   ├── DropdownMenuCheckboxItem
│   └── DropdownMenuCheckboxItem
├── DropdownMenuSeparator
├── DropdownMenuGroup
│   ├── DropdownMenuLabel
│   └── DropdownMenuRadioGroup
│       ├── DropdownMenuRadioItem
│       └── DropdownMenuRadioItem
└── DropdownMenuSub
├── DropdownMenuSubTrigger
└── DropdownMenuSubContent
└── DropdownMenuGroup
├── DropdownMenuLabel
├── DropdownMenuItem
└── DropdownMenuItem

"use client"

import { Button } from "@/components/ui/button"
import {
DropdownMenu,
DropdownMenuContent,
DropdownMenuGroup,
DropdownMenuItem,
DropdownMenuPortal,
DropdownMenuSeparator,
DropdownMenuShortcut,
DropdownMenuSub,
DropdownMenuSubContent,
DropdownMenuSubTrigger,
DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function DropdownMenuSubmenu() {
return (
<DropdownMenu>
<DropdownMenuTrigger render={<Button variant="outline">Open</Button>} />
<DropdownMenuContent>
<DropdownMenuGroup>
<DropdownMenuItem>Team</DropdownMenuItem>
<DropdownMenuSub>
<DropdownMenuSubTrigger>Invite users</DropdownMenuSubTrigger>
<DropdownMenuPortal>
<DropdownMenuSubContent>
<DropdownMenuItem>Email</DropdownMenuItem>
<DropdownMenuItem>Message</DropdownMenuItem>
<DropdownMenuSub>
<DropdownMenuSubTrigger>More options</DropdownMenuSubTrigger>
<DropdownMenuPortal>
<DropdownMenuSubContent>
<DropdownMenuItem>Calendly</DropdownMenuItem>
<DropdownMenuItem>Slack</DropdownMenuItem>
<DropdownMenuSeparator />
<DropdownMenuItem>Webhook</DropdownMenuItem>
</DropdownMenuSubContent>
</DropdownMenuPortal>
</DropdownMenuSub>
<DropdownMenuSeparator />
<DropdownMenuItem>Advanced...</DropdownMenuItem>
</DropdownMenuSubContent>
</DropdownMenuPortal>
</DropdownMenuSub>
<DropdownMenuItem>
New Team
<DropdownMenuShortcut>⌘+T</DropdownMenuShortcut>
</DropdownMenuItem>
</DropdownMenuGroup>
</DropdownMenuContent>
</DropdownMenu>
)
}

"use client"

import { Button } from "@/components/ui/button"
import {
DropdownMenu,
DropdownMenuContent,
DropdownMenuGroup,
DropdownMenuItem,
DropdownMenuLabel,
DropdownMenuSeparator,
DropdownMenuShortcut,
DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function DropdownMenuShortcuts() {
return (
<DropdownMenu>
<DropdownMenuTrigger render={<Button variant="outline">Open</Button>} />
<DropdownMenuContent>
<DropdownMenuGroup>
<DropdownMenuLabel>My Account</DropdownMenuLabel>
<DropdownMenuItem>
Profile
<DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
</DropdownMenuItem>
<DropdownMenuItem>
Billing
<DropdownMenuShortcut>⌘B</DropdownMenuShortcut>
</DropdownMenuItem>
<DropdownMenuItem>
Settings
<DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
</DropdownMenuItem>
</DropdownMenuGroup>
<DropdownMenuSeparator />
<DropdownMenuItem>
Log out
<DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
</DropdownMenuItem>
</DropdownMenuContent>
</DropdownMenu>
)
}

"use client"

import {
CreditCardIcon,
LogOutIcon,
SettingsIcon,
UserIcon,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import {
DropdownMenu,
DropdownMenuContent,
DropdownMenuItem,
DropdownMenuSeparator,
DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function DropdownMenuIcons() {
return (
<DropdownMenu>
<DropdownMenuTrigger render={<Button variant="outline">Open</Button>} />
<DropdownMenuContent>
<DropdownMenuItem>
<UserIcon />
Profile
</DropdownMenuItem>
<DropdownMenuItem>
<CreditCardIcon />
Billing
</DropdownMenuItem>
<DropdownMenuItem>
<SettingsIcon />
Settings
</DropdownMenuItem>
<DropdownMenuSeparator />
<DropdownMenuItem variant="destructive">
<LogOutIcon />
Log out
</DropdownMenuItem>
</DropdownMenuContent>
</DropdownMenu>
)
}

"use client"

import * as React from "react"

import { Button } from "@/components/ui/button"
import {
DropdownMenu,
DropdownMenuCheckboxItem,
DropdownMenuContent,
DropdownMenuGroup,
DropdownMenuLabel,
DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function DropdownMenuCheckboxes() {
const [showStatusBar, setShowStatusBar] = React.useState(true)
const [showActivityBar, setShowActivityBar] = React.useState(false)
const [showPanel, setShowPanel] = React.useState(false)

return (
<DropdownMenu>
<DropdownMenuTrigger render={<Button variant="outline">Open</Button>} />
<DropdownMenuContent className="w-40">
<DropdownMenuGroup>
<DropdownMenuLabel>Appearance</DropdownMenuLabel>
<DropdownMenuCheckboxItem
checked={showStatusBar ?? false}
onCheckedChange={setShowStatusBar}
>
Status Bar
</DropdownMenuCheckboxItem>
<DropdownMenuCheckboxItem
checked={showActivityBar}
onCheckedChange={setShowActivityBar}
disabled
>
Activity Bar
</DropdownMenuCheckboxItem>
<DropdownMenuCheckboxItem
checked={showPanel}
onCheckedChange={setShowPanel}
>
Panel
</DropdownMenuCheckboxItem>
</DropdownMenuGroup>
</DropdownMenuContent>
</DropdownMenu>
)
}

"use client"

import * as React from "react"

import { Button } from "@/components/ui/button"
import {
DropdownMenu,
DropdownMenuContent,
DropdownMenuGroup,
DropdownMenuLabel,
DropdownMenuRadioGroup,
DropdownMenuRadioItem,
DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function DropdownMenuRadioGroupDemo() {
const [position, setPosition] = React.useState("bottom")

return (
<DropdownMenu>
<DropdownMenuTrigger render={<Button variant="outline">Open</Button>} />
<DropdownMenuContent className="w-32">
<DropdownMenuGroup>
<DropdownMenuLabel>Panel Position</DropdownMenuLabel>
<DropdownMenuRadioGroup value={position} onValueChange={setPosition}>
<DropdownMenuRadioItem value="top">Top</DropdownMenuRadioItem>
<DropdownMenuRadioItem value="bottom">Bottom</DropdownMenuRadioItem>
<DropdownMenuRadioItem value="right">Right</DropdownMenuRadioItem>
</DropdownMenuRadioGroup>
</DropdownMenuGroup>
</DropdownMenuContent>
</DropdownMenu>
)
}

"use client"

import * as React from "react"
import { Building2Icon, CreditCardIcon, WalletIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
DropdownMenu,
DropdownMenuContent,
DropdownMenuGroup,
DropdownMenuLabel,
DropdownMenuRadioGroup,
DropdownMenuRadioItem,
DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function DropdownMenuRadioIcons() {
const [paymentMethod, setPaymentMethod] = React.useState("card")

return (
<DropdownMenu>
<DropdownMenuTrigger render={<Button variant="outline">Payment Method</Button>} />
<DropdownMenuContent className="min-w-56">
<DropdownMenuGroup>
<DropdownMenuLabel>Select Payment Method</DropdownMenuLabel>
<DropdownMenuRadioGroup
value={paymentMethod}
onValueChange={setPaymentMethod}
>
<DropdownMenuRadioItem value="card">
<CreditCardIcon />
Credit Card
</DropdownMenuRadioItem>
<DropdownMenuRadioItem value="paypal">
<WalletIcon />
PayPal
</DropdownMenuRadioItem>
<DropdownMenuRadioItem value="bank">
<Building2Icon />
Bank Transfer
</DropdownMenuRadioItem>
</DropdownMenuRadioGroup>
</DropdownMenuGroup>
</DropdownMenuContent>
</DropdownMenu>
)
}

"use client"

import { PencilIcon, ShareIcon, TrashIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
DropdownMenu,
DropdownMenuContent,
DropdownMenuGroup,
DropdownMenuItem,
DropdownMenuSeparator,
DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function DropdownMenuDestructive() {
return (
<DropdownMenu>
<DropdownMenuTrigger render={<Button variant="outline">Actions</Button>} />
<DropdownMenuContent>
<DropdownMenuGroup>
<DropdownMenuItem>
<PencilIcon />
Edit
</DropdownMenuItem>
<DropdownMenuItem>
<ShareIcon />
Share
</DropdownMenuItem>
</DropdownMenuGroup>
<DropdownMenuSeparator />
<DropdownMenuGroup>
<DropdownMenuItem variant="destructive">
<TrashIcon />
Delete
</DropdownMenuItem>
</DropdownMenuGroup>
</DropdownMenuContent>
</DropdownMenu>
)
}

"use client"

import {
BadgeCheckIcon,
BellIcon,
CreditCardIcon,
LogOutIcon,
} from "lucide-react"

import {
Avatar,
AvatarFallback,
AvatarImage,
} from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
DropdownMenu,
DropdownMenuContent,
DropdownMenuGroup,
DropdownMenuItem,
DropdownMenuSeparator,
DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function DropdownMenuAvatar() {
return (
<DropdownMenu>
<DropdownMenuTrigger render={<Button variant="ghost" size="icon" className="rounded-full"><Avatar>
<AvatarImage src="[https://github.com/shadcn.png](https://github.com/shadcn.png)" alt="shadcn" />
<AvatarFallback>LR</AvatarFallback>
</Avatar></Button>} />
<DropdownMenuContent align="end">
<DropdownMenuGroup>
<DropdownMenuItem>
<BadgeCheckIcon />
Account
</DropdownMenuItem>
<DropdownMenuItem>
<CreditCardIcon />
Billing
</DropdownMenuItem>
<DropdownMenuItem>
<BellIcon />
Notifications
</DropdownMenuItem>
</DropdownMenuGroup>
<DropdownMenuSeparator />
<DropdownMenuItem>
<LogOutIcon />
Sign Out
</DropdownMenuItem>
</DropdownMenuContent>
</DropdownMenu>
)
}

"use client"

import * as React from "react"
import {
BellIcon,
CreditCardIcon,
DownloadIcon,
EyeIcon,
FileCodeIcon,
FileIcon,
FileTextIcon,
FolderIcon,
FolderOpenIcon,
FolderSearchIcon,
HelpCircleIcon,
KeyboardIcon,
LanguagesIcon,
LayoutIcon,
LogOutIcon,
MailIcon,
MonitorIcon,
MoonIcon,
MoreHorizontalIcon,
PaletteIcon,
SaveIcon,
SettingsIcon,
ShieldIcon,
SunIcon,
UserIcon,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import {
DropdownMenu,
DropdownMenuCheckboxItem,
DropdownMenuContent,
DropdownMenuGroup,
DropdownMenuItem,
DropdownMenuLabel,
DropdownMenuPortal,
DropdownMenuRadioGroup,
DropdownMenuRadioItem,
DropdownMenuSeparator,
DropdownMenuShortcut,
DropdownMenuSub,
DropdownMenuSubContent,
DropdownMenuSubTrigger,
DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function DropdownMenuComplex() {
const [notifications, setNotifications] = React.useState({
email: true,
sms: false,
push: true,
})
const [theme, setTheme] = React.useState("light")

return (
<DropdownMenu>
<DropdownMenuTrigger render={<Button variant="outline">Complex Menu</Button>} />
<DropdownMenuContent className="w-44">
<DropdownMenuGroup>
<DropdownMenuLabel>File</DropdownMenuLabel>
<DropdownMenuItem>
<FileIcon />
New File
<DropdownMenuShortcut>⌘N</DropdownMenuShortcut>
</DropdownMenuItem>
<DropdownMenuItem>
<FolderIcon />
New Folder
<DropdownMenuShortcut>⇧⌘N</DropdownMenuShortcut>
</DropdownMenuItem>
<DropdownMenuSub>
<DropdownMenuSubTrigger>
<FolderOpenIcon />
Open Recent
</DropdownMenuSubTrigger>
<DropdownMenuPortal>
<DropdownMenuSubContent>
<DropdownMenuGroup>
<DropdownMenuLabel>Recent Projects</DropdownMenuLabel>
<DropdownMenuItem>
<FileCodeIcon />
Project Alpha
</DropdownMenuItem>
<DropdownMenuItem>
<FileCodeIcon />
Project Beta
</DropdownMenuItem>
<DropdownMenuSub>
<DropdownMenuSubTrigger>
<MoreHorizontalIcon />
More Projects
</DropdownMenuSubTrigger>
<DropdownMenuPortal>
<DropdownMenuSubContent>
<DropdownMenuItem>
<FileCodeIcon />
Project Gamma
</DropdownMenuItem>
<DropdownMenuItem>
<FileCodeIcon />
Project Delta
</DropdownMenuItem>
</DropdownMenuSubContent>
</DropdownMenuPortal>
</DropdownMenuSub>
</DropdownMenuGroup>
<DropdownMenuSeparator />
<DropdownMenuGroup>
<DropdownMenuItem>
<FolderSearchIcon />
Browse...
</DropdownMenuItem>
</DropdownMenuGroup>
</DropdownMenuSubContent>
</DropdownMenuPortal>
</DropdownMenuSub>
<DropdownMenuSeparator />
<DropdownMenuItem>
<SaveIcon />
Save
<DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
</DropdownMenuItem>
<DropdownMenuItem>
<DownloadIcon />
Export
<DropdownMenuShortcut>⇧⌘E</DropdownMenuShortcut>
</DropdownMenuItem>
</DropdownMenuGroup>
<DropdownMenuSeparator />
<DropdownMenuGroup>
<DropdownMenuLabel>View</DropdownMenuLabel>
<DropdownMenuCheckboxItem
checked={notifications.email}
onCheckedChange={(checked) =>
setNotifications({ ...notifications, email: checked === true })
}
>
<EyeIcon />
Show Sidebar
</DropdownMenuCheckboxItem>
<DropdownMenuCheckboxItem
checked={notifications.sms}
onCheckedChange={(checked) =>
setNotifications({ ...notifications, sms: checked === true })
}
>
<LayoutIcon />
Show Status Bar
</DropdownMenuCheckboxItem>
<DropdownMenuSub>
<DropdownMenuSubTrigger>
<PaletteIcon />
Theme
</DropdownMenuSubTrigger>
<DropdownMenuPortal>
<DropdownMenuSubContent>
<DropdownMenuGroup>
<DropdownMenuLabel>Appearance</DropdownMenuLabel>
<DropdownMenuRadioGroup
value={theme}
onValueChange={setTheme}
>
<DropdownMenuRadioItem value="light">
<SunIcon />
Light
</DropdownMenuRadioItem>
<DropdownMenuRadioItem value="dark">
<MoonIcon />
Dark
</DropdownMenuRadioItem>
<DropdownMenuRadioItem value="system">
<MonitorIcon />
System
</DropdownMenuRadioItem>
</DropdownMenuRadioGroup>
</DropdownMenuGroup>
</DropdownMenuSubContent>
</DropdownMenuPortal>
</DropdownMenuSub>
</DropdownMenuGroup>
<DropdownMenuSeparator />
<DropdownMenuGroup>
<DropdownMenuLabel>Account</DropdownMenuLabel>
<DropdownMenuItem>
<UserIcon />
Profile
<DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
</DropdownMenuItem>
<DropdownMenuItem>
<CreditCardIcon />
Billing
</DropdownMenuItem>
<DropdownMenuSub>
<DropdownMenuSubTrigger>
<SettingsIcon />
Settings
</DropdownMenuSubTrigger>
<DropdownMenuPortal>
<DropdownMenuSubContent>
<DropdownMenuGroup>
<DropdownMenuLabel>Preferences</DropdownMenuLabel>
<DropdownMenuItem>
<KeyboardIcon />
Keyboard Shortcuts
</DropdownMenuItem>
<DropdownMenuItem>
<LanguagesIcon />
Language
</DropdownMenuItem>
<DropdownMenuSub>
<DropdownMenuSubTrigger>
<BellIcon />
Notifications
</DropdownMenuSubTrigger>
<DropdownMenuPortal>
<DropdownMenuSubContent>
<DropdownMenuGroup>
<DropdownMenuLabel>
Notification Types
</DropdownMenuLabel>
<DropdownMenuCheckboxItem
checked={notifications.push}
onCheckedChange={(checked) =>
setNotifications({
...notifications,
push: checked === true,
})
}
>
<BellIcon />
Push Notifications
</DropdownMenuCheckboxItem>
<DropdownMenuCheckboxItem
checked={notifications.email}
onCheckedChange={(checked) =>
setNotifications({
...notifications,
email: checked === true,
})
}
>
<MailIcon />
Email Notifications
</DropdownMenuCheckboxItem>
</DropdownMenuGroup>
</DropdownMenuSubContent>
</DropdownMenuPortal>
</DropdownMenuSub>
</DropdownMenuGroup>
<DropdownMenuSeparator />
<DropdownMenuGroup>
<DropdownMenuItem>
<ShieldIcon />
Privacy & Security
</DropdownMenuItem>
</DropdownMenuGroup>
</DropdownMenuSubContent>
</DropdownMenuPortal>
</DropdownMenuSub>
</DropdownMenuGroup>
<DropdownMenuSeparator />
<DropdownMenuGroup>
<DropdownMenuItem>
<HelpCircleIcon />
Help & Support
</DropdownMenuItem>
<DropdownMenuItem>
<FileTextIcon />
Documentation
</DropdownMenuItem>
</DropdownMenuGroup>
<DropdownMenuSeparator />
<DropdownMenuGroup>
<DropdownMenuItem variant="destructive">
<LogOutIcon />
Sign Out
<DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
</DropdownMenuItem>
</DropdownMenuGroup>
</DropdownMenuContent>
</DropdownMenu>
)
}

"use client"

import { Button } from "@/components/ui/button"
import { toast } from "@/components/ui/toast"

export function ToastDemo() {
function showToast() {
const id = toast.add({
title: "Event created",
description: "Sunday, December 3 at 9:00 AM",
actionProps: {
children: "Undo",
onClick() {
toast.close(id)
},
},
})
}

return (
<Button variant="outline" onClick={showToast}>
Show Toast
</Button>
)
}

"use client"

import { Button } from "@/components/ui/button"
import { toast } from "@/components/ui/toast"

export function ToastTypes() {
return (
<div className="flex flex-wrap gap-2">
<Button
variant="outline"
onClick={() => toast.add({ description: "Event has been created." })}
>
Default
</Button>
<Button
variant="outline"
onClick={() =>
toast.add({
type: "success",
description: "Event has been created.",
})
}
>
Success
</Button>
<Button
variant="outline"
onClick={() =>
toast.add({
type: "info",
description: "Arrive 10 minutes before the event.",
})
}
>
Info
</Button>
<Button
variant="outline"
onClick={() =>
toast.add({
type: "warning",
description: "The event cannot start before 8:00 AM.",
})
}
>
Warning
</Button>
<Button
variant="outline"
onClick={() =>
toast.add({
type: "error",
description: "The event could not be created.",
priority: "high",
})
}
>
Error
</Button>
</div>
)
}

"use client"

import { Button } from "@/components/ui/button"
import { toast } from "@/components/ui/toast"

export function ToastPromise() {
function showToast() {
toast.promise(
new Promise<{ name: string }>((resolve) => {
window.setTimeout(() => resolve({ name: "Event" }), 2000)
}),
{
loading: "Creating event…",
success: (data) => `${data.name} created.`,
error: "Could not create event.",
}
)
}

return (
<Button variant="outline" onClick={showToast}>
Create Event
</Button>
)
}

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
Sheet,
SheetClose,
SheetContent,
SheetDescription,
SheetFooter,
SheetHeader,
SheetTitle,
SheetTrigger,
} from "@/components/ui/sheet"

export function SheetDemo() {
return (
<Sheet>
<SheetTrigger render={<Button variant="outline">Open</Button>} />
<SheetContent>
<SheetHeader>
<SheetTitle>Edit profile</SheetTitle>
<SheetDescription>
Make changes to your profile here. Click save when you're done.
</SheetDescription>
</SheetHeader>
<div className="grid flex-1 auto-rows-min gap-6 px-4">
<div className="grid gap-3">
<Label htmlFor="sheet-demo-name">Name</Label>
<Input id="sheet-demo-name" defaultValue="Pedro Duarte" />
</div>
<div className="grid gap-3">
<Label htmlFor="sheet-demo-username">Username</Label>
<Input id="sheet-demo-username" defaultValue="@peduarte" />
</div>
</div>
<SheetFooter>
<Button type="submit">Save changes</Button>
<SheetClose render={<Button variant="outline">Close</Button>} />
</SheetFooter>
</SheetContent>
</Sheet>
)
}

Sheet
├── SheetTrigger
└── SheetContent
├── SheetHeader
│   ├── SheetTitle
│   └── SheetDescription
└── SheetFooter

import { Button } from "@/components/ui/button"
import {
Sheet,
SheetClose,
SheetContent,
SheetDescription,
SheetFooter,
SheetHeader,
SheetTitle,
SheetTrigger,
} from "@/components/ui/sheet"

const SHEET_SIDES = ["top", "right", "bottom", "left"] as const

export function SheetSide() {
return (
<div className="flex flex-wrap gap-2">
{SHEET_SIDES.map((side) => (
<Sheet key={side}>
<SheetTrigger render={<Button variant="outline" className="capitalize">{side}</Button>} />
<SheetContent
side={side}
className="data-[side=bottom]:max-h-[50vh] data-[side=top]:max-h-[50vh]"
>
<SheetHeader>
<SheetTitle>Edit profile</SheetTitle>
<SheetDescription>
Make changes to your profile here. Click save when you're
done.
</SheetDescription>
</SheetHeader>
<div className="no-scrollbar overflow-y-auto px-4">
{Array.from({ length: 10 }).map((_, index) => (
<p key={index} className="mb-2 leading-relaxed">
Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
do eiusmod tempor incididunt ut labore et dolore magna aliqua.
Ut enim ad minim veniam, quis nostrud exercitation ullamco
laboris nisi ut aliquip ex ea commodo consequat. Duis aute
irure dolor in reprehenderit in voluptate velit esse cillum
dolore eu fugiat nulla pariatur. Excepteur sint occaecat
cupidatat non proident, sunt in culpa qui officia deserunt
mollit anim id est laborum.
</p>
))}
</div>
<SheetFooter>
<Button type="submit">Save changes</Button>
<SheetClose render={<Button variant="outline">Cancel</Button>} />
</SheetFooter>
</SheetContent>
</Sheet>
))}
</div>
)
}

import { Separator } from "@/components/ui/separator"

export function SeparatorDemo() {
return (
<div className="flex max-w-sm flex-col gap-4 text-sm">
<div className="flex flex-col gap-1.5">
<div className="leading-none font-medium">shadcn/ui</div>
<div className="text-muted-foreground">
The Foundation for your Design System
</div>
</div>
<Separator />
<div>
A set of beautifully designed components that you can customize, extend,
and build on.
</div>
</div>
)
}

npx shadcn@latest add separator

import { Separator } from "@/components/ui/separator"

export function SeparatorVertical() {
return (
<div className="flex h-5 items-center gap-4 text-sm">
<div>Blog</div>
<Separator orientation="vertical" />
<div>Docs</div>
<Separator orientation="vertical" />
<div>Source</div>
</div>
)
}

import { Separator } from "@/components/ui/separator"

export function SeparatorMenu() {
return (
<div className="flex items-center gap-2 text-sm md:gap-4">
<div className="flex flex-col gap-1">
<span className="font-medium">Settings</span>
<span className="text-xs text-muted-foreground">
Manage preferences
</span>
</div>
<Separator orientation="vertical" />
<div className="flex flex-col gap-1">
<span className="font-medium">Account</span>
<span className="text-xs text-muted-foreground">
Profile & security
</span>
</div>
<Separator orientation="vertical" className="hidden md:block" />
<div className="hidden flex-col gap-1 md:flex">
<span className="font-medium">Help</span>
<span className="text-xs text-muted-foreground">Support & docs</span>
</div>
</div>
)
}

import { Separator } from "@/components/ui/separator"

export function SeparatorList() {
return (
<div className="flex w-full max-w-sm flex-col gap-2 text-sm">
<dl className="flex items-center justify-between">
<dt>Item 1</dt>
<dd className="text-muted-foreground">Value 1</dd>
</dl>
<Separator />
<dl className="flex items-center justify-between">
<dt>Item 2</dt>
<dd className="text-muted-foreground">Value 2</dd>
</dl>
<Separator />
<dl className="flex items-center justify-between">
<dt>Item 3</dt>
<dd className="text-muted-foreground">Value 3</dd>
</dl>
</div>
)
}

import * as React from "react"

import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"

const tags = Array.from({ length: 50 }).map(
(_, i, a) => `v1.2.0-beta.${a.length - i}`
)

export function ScrollAreaDemo() {
return (
<ScrollArea className="h-72 w-48 rounded-md border">
<div className="p-4">
<h4 className="mb-4 text-sm leading-none font-medium">Tags</h4>
{tags.map((tag) => (
<React.Fragment key={tag}>
<div className="text-sm">{tag}</div>
<Separator className="my-2" />
</React.Fragment>
))}
</div>
</ScrollArea>
)
}

import * as React from "react"
import Image from "next/image"

import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"

export interface Artwork {
artist: string
art: string
}

export const works: Artwork[] = [
{
artist: "Ornella Binni",
art: "[https://images.unsplash.com/photo-1465869185982-5a1a7522cbcb?auto=format&fit=crop&w=300&q=80](https://images.unsplash.com/photo-1465869185982-5a1a7522cbcb?auto=format&fit=crop&w=300&q=80)",
},
{
artist: "Tom Byrom",
art: "[https://images.unsplash.com/photo-1548516173-3cabfa4607e9?auto=format&fit=crop&w=300&q=80](https://images.unsplash.com/photo-1548516173-3cabfa4607e9?auto=format&fit=crop&w=300&q=80)",
},
{
artist: "Vladimir Malyavko",
art: "[https://images.unsplash.com/photo-1494337480532-3725c85fd2ab?auto=format&fit=crop&w=300&q=80](https://images.unsplash.com/photo-1494337480532-3725c85fd2ab?auto=format&fit=crop&w=300&q=80)",
},
]

export function ScrollAreaHorizontalDemo() {
return (
<ScrollArea className="w-96 rounded-md border whitespace-nowrap">
<div className="flex w-max space-x-4 p-4">
{works.map((artwork) => (
<figure key={artwork.artist} className="shrink-0">
<div className="overflow-hidden rounded-md">
<Image
src={artwork.art}
alt={`Photo by ${artwork.artist}`}
className="aspect-[3/4] h-fit w-fit object-cover"
width={300}
height={400}
/>
</div>
<figcaption className="pt-2 text-xs text-muted-foreground">
Photo by{" "}
<span className="font-semibold text-foreground">
{artwork.artist}
</span>
</figcaption>
</figure>
))}
</div>
<ScrollBar orientation="horizontal" />
</ScrollArea>
)
}

"use client"

import * as React from "react"

import {
useTranslation,
type Translations,
} from "@/components/language-selector"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"

const tags = Array.from({ length: 50 }).map(
(_, i, a) => `v1.2.0-beta.${a.length - i}`
)

const translations: Translations = {
en: {
dir: "ltr",
values: {
tags: "Tags",
},
},
ar: {
dir: "rtl",
values: {
tags: "العلامات",
},
},
he: {
dir: "rtl",
values: {
tags: "תגיות",
},
},
}

export function ScrollAreaRtl() {
const { dir, t } = useTranslation(translations, "ar")

return (
<ScrollArea className="h-72 w-48 rounded-md border" dir={dir}>
<div className="p-4">
<h4 className="mb-4 text-sm leading-none font-medium">{t.tags}</h4>
{tags.map((tag) => (
<React.Fragment key={tag}>
<div className="text-sm">{tag}</div>
<Separator className="my-2" />
</React.Fragment>
))}
</div>
</ScrollArea>
)
}

21st dev components

// --- Component ---
"use client";

import NumberFlow, { type Value } from "@number-flow/react";

type NumberTickerProps = {
value: Value;
currency?: string;
decimals?: number;
className?: string;
};

/**

- NumberTicker 02 - Money Flow
- Premium currency display with smooth high-fidelity rolls.
*/
export default function NumberTicker({
value,
currency = "USD",
decimals = 2,
className,
}: NumberTickerProps) {
return (
<div className="inline-flex items-center gap-3">
<NumberFlow
value={value}
format={{
style: "currency",
currency: currency,
minimumFractionDigits: decimals,
maximumFractionDigits: decimals,
}}
className={className}
/>
</div>
);
}

// --- Demo ---
"use client";

import * as React from "react";
import NumberTicker from "@/components/ui/number-ticker-02";

export default function NumberTickerDemo() {
const [val, setVal] = React.useState(1284.5);

React.useEffect(() => {
const interval = setInterval(() => {
setVal((prev) => prev + (Math.random() * 50 - 20));
}, 2500);
return () => clearInterval(interval);
}, []);

return (
<div>
<NumberTicker
value={val}
className="text-foreground font-medium lg:text-5xl sm:text-4xl text-3xl tracking-tight"
/>
</div>
);
}

// --- Component ---
"use client"

import React, { CSSProperties, useEffect, useRef } from "react"
import { motion } from "motion/react"

import { cn } from "@/lib/utils"

interface BorderBeamProps {
lightWidth?: number
duration?: number
lightColor?: string
borderWidth?: number
className?: string
[key: string]: unknown
}

export function BorderBeam({
lightWidth = 200,
duration = 10,
lightColor = "#FAFAFA",
borderWidth = 1,
className,
...props
}: BorderBeamProps) {
const pathRef = useRef<HTMLDivElement>(null)

const updatePath = () => {
if (pathRef.current) {
const div = pathRef.current
div.style.setProperty(
"--path",
`path("M 0 0 H ${div.offsetWidth} V ${div.offsetHeight} H 0 V 0")`
)
}
}

useEffect(() => {
updatePath()
window.addEventListener("resize", updatePath)

```
return () => {
  window.removeEventListener("resize", updatePath)
}
```

}, [])

return (
<div
style={
{
"--duration": duration,
"--border-width": `${borderWidth}px`,
} as CSSProperties
}
ref={pathRef}
className={cn(
`absolute z-0 h-full w-full rounded-[inherit]`,
`after:absolute after:inset-[var(--border-width)] after:rounded-[inherit] after:content-['']`,
"border-[length:var(--border-width)] ![mask-clip:padding-box,border-box]",
"![mask-composite:intersect] [mask:linear-gradient(transparent,transparent),linear-gradient(red,red)]",
`before:absolute before:inset-0 before:z-[-1] before:rounded-[inherit] before:border-[length:var(--border-width)] before:border-black/10 dark:before:border-white/10`,
className
)}
{...props}
>
<motion.div
className="absolute inset-0 aspect-square bg-[radial-gradient(ellipse_at_center,var(--light-color),transparent,transparent)]"
style={
{
"--light-color": lightColor,
"--light-width": `${lightWidth}px`,
width: "var(--light-width)",
offsetPath: "var(--path)",
} as CSSProperties
}
animate={{
offsetDistance: ["0%", "100%"],
}}
transition={{
duration: duration,
repeat: Infinity,
ease: "linear",
}}
/>
</div>
)
}

// --- Demo ---
"use client"

import { useEffect, useState } from "react"
import { useTheme } from "next-themes"

import { BorderBeam } from "@/components/ui/border-beam"

export default function BorderBeamDemo() {
const { theme } = useTheme()
const [lightColor, setLightColor] = useState("#FAFAFA")

useEffect(() => {
setLightColor(theme === "dark" ? "#FAFAFA" : "#FF2056")
}, [theme])

return (
<div className="relative overflow-hidden rounded-lg shadow-sm">
<BorderBeam lightColor={lightColor} lightWidth={350} duration={8} />
<div className="h-full w-full max-w-72 space-y-2 px-6 py-4">
<h3 className="font-gilroy text-2xl">Border Beam</h3>
<p className="text-sm">
This card showcases a dynamic border beam effect, adding a subtle,
animated glow around the edges.
</p>
</div>
</div>
)
}

// --- Component ---
"use client";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import React, {
ReactNode,
createContext,
useContext,
useEffect,
useRef,
useState,
} from "react";

interface ModalContextType {
open: boolean;
setOpen: (open: boolean) => void;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export const ModalProvider = ({ children }: { children: ReactNode }) => {
const [open, setOpen] = useState(false);

return (
<ModalContext.Provider value={{ open, setOpen }}>
{children}
</ModalContext.Provider>
);
};

export const useModal = () => {
const context = useContext(ModalContext);
if (!context) {
throw new Error("useModal must be used within a ModalProvider");
}
return context;
};

export function Modal({ children }: { children: ReactNode }) {
return <ModalProvider>{children}</ModalProvider>;
}

export const ModalTrigger = ({
children,
className,
}: {
children: ReactNode;
className?: string;
}) => {
const { setOpen } = useModal();
return (
<button
className={cn(
"px-4 py-2 rounded-md text-black dark:text-white text-center relative overflow-hidden",
className
)}
onClick={() => setOpen(true)}
>
{children}
</button>
);
};

export const ModalBody = ({
children,
className,
}: {
children: ReactNode;
className?: string;
}) => {
const { open } = useModal();

useEffect(() => {
if (open) {
document.body.style.overflow = "hidden";
} else {
document.body.style.overflow = "auto";
}
}, [open]);

const modalRef = useRef(null);
const { setOpen } = useModal();
useOutsideClick(modalRef, () => setOpen(false));

return (
<AnimatePresence>
{open && (
<motion.div
initial={{
opacity: 0,
}}
animate={{
opacity: 1,
backdropFilter: "blur(10px)",
}}
exit={{
opacity: 0,
backdropFilter: "blur(0px)",
}}
className="fixed [perspective:800px] [transform-style:preserve-3d] inset-0 h-full w-full  flex items-center justify-center z-50"
>
<Overlay />

```
      <motion.div
        ref={modalRef}
        className={cn(
          "min-h-[50%] max-h-[90%] md:max-w-[40%] bg-white dark:bg-neutral-950 border border-transparent dark:border-neutral-800 md:rounded-2xl relative z-50 flex flex-col flex-1 overflow-hidden",
          className
        )}
        initial={{
          opacity: 0,
          scale: 0.5,
          rotateX: 40,
          y: 40,
        }}
        animate={{
          opacity: 1,
          scale: 1,
          rotateX: 0,
          y: 0,
        }}
        exit={{
          opacity: 0,
          scale: 0.8,
          rotateX: 10,
        }}
        transition={{
          type: "spring",
          stiffness: 260,
          damping: 15,
        }}
      >
        <CloseIcon />
        {children}
      </motion.div>
    </motion.div>
  )}
</AnimatePresence>
```

);
};

export const ModalContent = ({
children,
className,
}: {
children: ReactNode;
className?: string;
}) => {
return (
<div className={cn("flex flex-col flex-1 p-8 md:p-10", className)}>
{children}
</div>
);
};

export const ModalFooter = ({
children,
className,
}: {
children: ReactNode;
className?: string;
}) => {
return (
<div
className={cn(
"flex justify-end p-4 bg-gray-100 dark:bg-neutral-900",
className
)}
>
{children}
</div>
);
};

const Overlay = ({ className }: { className?: string }) => {
return (
<motion.div
initial={{
opacity: 0,
}}
animate={{
opacity: 1,
backdropFilter: "blur(10px)",
}}
exit={{
opacity: 0,
backdropFilter: "blur(0px)",
}}
className={`fixed inset-0 h-full w-full bg-black bg-opacity-50 z-50 ${className}`}
></motion.div>
);
};

const CloseIcon = () => {
const { setOpen } = useModal();
return (
<button
onClick={() => setOpen(false)}
className="absolute top-4 right-4 group"
>
<svg
xmlns="[http://www.w3.org/2000/svg](http://www.w3.org/2000/svg)"
width="24"
height="24"
viewBox="0 0 24 24"
fill="none"
stroke="currentColor"
strokeWidth="2"
strokeLinecap="round"
strokeLinejoin="round"
className="text-black dark:text-white h-4 w-4 group-hover:scale-125 group-hover:rotate-3 transition duration-200"
>
<path stroke="none" d="M0 0h24v24H0z" fill="none" />
<path d="M18 6l-12 12" />
<path d="M6 6l12 12" />
</svg>
</button>
);
};

// Hook to detect clicks outside of a component.
// Add it in a separate file, I've added here for simplicity
export const useOutsideClick = (
ref: React.RefObject<HTMLDivElement>,
callback: Function
) => {
useEffect(() => {
const listener = (event: any) => {
// DO NOTHING if the element being clicked is the target element or their children
if (!ref.current || ref.current.contains(event.target)) {
return;
}
callback(event);
};

```
document.addEventListener("mousedown", listener);
document.addEventListener("touchstart", listener);

return () => {
  document.removeEventListener("mousedown", listener);
  document.removeEventListener("touchstart", listener);
};
```

}, [ref, callback]);
};

// --- Demo ---
"use client";
import React from "react";
import {
Modal,
ModalBody,
ModalContent,
ModalFooter,
ModalTrigger,
} from "@/components/ui/animated-modal";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { motion } from "framer-motion";

export function AnimatedModalDemo() {
const images = [
"[https://cdn.21st.dev/assets/mirror/dd/dd67633bde783584b4b4c11fccb9d64ee21156be0fd5d92b68d51b53737e0821.jpg](https://cdn.21st.dev/assets/mirror/dd/dd67633bde783584b4b4c11fccb9d64ee21156be0fd5d92b68d51b53737e0821.jpg)",
"[https://cdn.21st.dev/assets/mirror/38/389eef0fc02dbb01a69d2f3458540ac82ac9d6a6eb8d56393b662dad6535265c.jpg](https://cdn.21st.dev/assets/mirror/38/389eef0fc02dbb01a69d2f3458540ac82ac9d6a6eb8d56393b662dad6535265c.jpg)",
"[https://cdn.21st.dev/assets/mirror/8d/8d9086ddc195406f010846e2f919ca31758fcdc7d2826dfff01998c48f0a8177.jpg](https://cdn.21st.dev/assets/mirror/8d/8d9086ddc195406f010846e2f919ca31758fcdc7d2826dfff01998c48f0a8177.jpg)",
"[https://cdn.21st.dev/assets/mirror/53/536b3830e8b428b39396aac770384cff246893fc12d63bab186a9b6bf1dcb08d.jpg](https://cdn.21st.dev/assets/mirror/53/536b3830e8b428b39396aac770384cff246893fc12d63bab186a9b6bf1dcb08d.jpg)",
"[https://cdn.21st.dev/assets/mirror/4a/4a8e67c1e867164a693c5c4e6fa22d6462008107c65f724ad39c7884c1393d8d.jpg](https://cdn.21st.dev/assets/mirror/4a/4a8e67c1e867164a693c5c4e6fa22d6462008107c65f724ad39c7884c1393d8d.jpg)",
];
return (
<div className="py-40 flex items-center justify-center">
<Modal>
<ModalTrigger asChild>
<Button
variant="default"
className="relative group/modal-btn bg-black dark:bg-white dark:text-black text-white hover:bg-black/90 dark:hover:bg-white/90"
>
<span className="group-hover/modal-btn:translate-x-40 text-center transition duration-500">
Book your flight
</span>
<div className="-translate-x-40 group-hover/modal-btn:translate-x-0 flex items-center justify-center absolute inset-0 transition duration-500 text-white dark:text-black z-20">
✈️
</div>
</Button>
</ModalTrigger>
<ModalBody>
<ModalContent>
<h4 className="text-lg md:text-2xl text-neutral-600 dark:text-neutral-100 font-bold text-center mb-8">
Book your trip to{" "}
<span className="px-1 py-0.5 rounded-md bg-gray-100 dark:bg-neutral-800 dark:border-neutral-700 border border-gray-200">
Bali
</span>{" "}
now! ✈️
</h4>
<div className="flex justify-center items-center">
{images.map((image, idx) => (
<motion.div
key={"images" + idx}
style={{
rotate: Math.random() * 20 - 10,
}}
whileHover={{
scale: 1.1,
rotate: 0,
zIndex: 100,
}}
whileTap={{
scale: 1.1,
rotate: 0,
zIndex: 100,
}}
className="rounded-xl -mr-4 mt-4 p-1 bg-white dark:bg-neutral-800 dark:border-neutral-700 border border-neutral-100 flex-shrink-0 overflow-hidden"
>
<Image
src={image}
alt="bali images"
width="500"
height="500"
className="rounded-lg h-20 w-20 md:h-40 md:w-40 object-cover flex-shrink-0"
/>
</motion.div>
))}
</div>
<div className="py-10 flex flex-wrap gap-x-4 gap-y-6 items-start justify-start max-w-sm mx-auto">
<div className="flex items-center justify-center">
<PlaneIcon className="mr-1 text-neutral-700 dark:text-neutral-300 h-4 w-4" />
<span className="text-neutral-700 dark:text-neutral-300 text-sm">
5 connecting flights
</span>
</div>
<div className="flex items-center justify-center">
<ElevatorIcon className="mr-1 text-neutral-700 dark:text-neutral-300 h-4 w-4" />
<span className="text-neutral-700 dark:text-neutral-300 text-sm">
12 hotels
</span>
</div>
<div className="flex items-center justify-center">
<VacationIcon className="mr-1 text-neutral-700 dark:text-neutral-300 h-4 w-4" />
<span className="text-neutral-700 dark:text-neutral-300 text-sm">
69 visiting spots
</span>
</div>
<div className="flex items-center justify-center">
<FoodIcon className="mr-1 text-neutral-700 dark:text-neutral-300 h-4 w-4" />
<span className="text-neutral-700 dark:text-neutral-300 text-sm">
Good food everyday
</span>
</div>
<div className="flex items-center justify-center">
<MicIcon className="mr-1 text-neutral-700 dark:text-neutral-300 h-4 w-4" />
<span className="text-neutral-700 dark:text-neutral-300 text-sm">
Open Mic
</span>
</div>
<div className="flex items-center justify-center">
<ParachuteIcon className="mr-1 text-neutral-700 dark:text-neutral-300 h-4 w-4" />
<span className="text-neutral-700 dark:text-neutral-300 text-sm">
Paragliding
</span>
</div>
</div>
</ModalContent>
<ModalFooter className="gap-4">
<Button
variant="secondary"
className="w-28 bg-gray-200 text-black dark:bg-black dark:border-black dark:text-white border border-gray-300"
>
Cancel
</Button>
<Button
variant="default"
className="w-28 bg-black text-white dark:bg-white dark:text-black border border-black"
>
Book Now
</Button>
</ModalFooter>
</ModalBody>
</Modal>
</div>
);
}

const PlaneIcon = ({ className }: { className?: string }) => {
return (
<svg
xmlns="[http://www.w3.org/2000/svg](http://www.w3.org/2000/svg)"
width="24"
height="24"
viewBox="0 0 24 24"
fill="none"
stroke="currentColor"
strokeWidth="2"
strokeLinecap="round"
strokeLinejoin="round"
className={className}
>
<path stroke="none" d="M0 0h24v24H0z" fill="none" />
<path d="M16 10h4a2 2 0 0 1 0 4h-4l-4 7h-3l2 -7h-4l-2 2h-3l2 -4l-2 -4h3l2 2h4l-2 -7h3z" />
</svg>
);
};

const VacationIcon = ({ className }: { className?: string }) => {
return (
<svg
xmlns="[http://www.w3.org/2000/svg](http://www.w3.org/2000/svg)"
width="24"
height="24"
viewBox="0 0 24 24"
fill="none"
stroke="currentColor"
strokeWidth="2"
strokeLinecap="round"
strokeLinejoin="round"
className={className}
>
<path stroke="none" d="M0 0h24v24H0z" fill="none" />
<path d="M17.553 16.75a7.5 7.5 0 0 0 -10.606 0" />
<path d="M18 3.804a6 6 0 0 0 -8.196 2.196l10.392 6a6 6 0 0 0 -2.196 -8.196z" />
<path d="M16.732 10c1.658 -2.87 2.225 -5.644 1.268 -6.196c-.957 -.552 -3.075 1.326 -4.732 4.196" />
<path d="M15 9l-3 5.196" />
<path d="M3 19.25a2.4 2.4 0 0 1 1 -.25a2.4 2.4 0 0 1 2 1a2.4 2.4 0 0 0 2 1a2.4 2.4 0 0 0 2 -1a2.4 2.4 0 0 1 2 -1a2.4 2.4 0 0 1 2 1a2.4 2.4 0 0 0 2 1a2.4 2.4 0 0 0 2 -1a2.4 2.4 0 0 1 2 -1a2.4 2.4 0 0 1 1 .25" />
</svg>
);
};

const ElevatorIcon = ({ className }: { className?: string }) => {
return (
<svg
xmlns="[http://www.w3.org/2000/svg](http://www.w3.org/2000/svg)"
width="24"
height="24"
viewBox="0 0 24 24"
fill="none"
stroke="currentColor"
strokeWidth="2"
strokeLinecap="round"
strokeLinejoin="round"
className={className}
>
<path stroke="none" d="M0 0h24v24H0z" fill="none" />
<path d="M5 4m0 1a1 1 0 0 1 1 -1h12a1 1 0 0 1 1 1v14a1 1 0 0 1 -1 1h-12a1 1 0 0 1 -1 -1z" />
<path d="M10 10l2 -2l2 2" />
<path d="M10 14l2 2l2 -2" />
</svg>
);
};

const FoodIcon = ({ className }: { className?: string }) => {
return (
<svg
xmlns="[http://www.w3.org/2000/svg](http://www.w3.org/2000/svg)"
width="24"
height="24"
viewBox="0 0 24 24"
fill="none"
stroke="currentColor"
strokeWidth="2"
strokeLinecap="round"
strokeLinejoin="round"
className={className}
>
<path stroke="none" d="M0 0h24v24H0z" fill="none" />
<path d="M20 20c0 -3.952 -.966 -16 -4.038 -16s-3.962 9.087 -3.962 14.756c0 -5.669 -.896 -14.756 -3.962 -14.756c-3.065 0 -4.038 12.048 -4.038 16" />
</svg>
);
};

const MicIcon = ({ className }: { className?: string }) => {
return (
<svg
xmlns="[http://www.w3.org/2000/svg](http://www.w3.org/2000/svg)"
width="24"
height="24"
viewBox="0 0 24 24"
fill="none"
stroke="currentColor"
strokeWidth="2"
strokeLinecap="round"
strokeLinejoin="round"
className={className}
>
<path stroke="none" d="M0 0h24v24H0z" fill="none" />
<path d="M15 12.9a5 5 0 1 0 -3.902 -3.9" />
<path d="M15 12.9l-3.902 -3.899l-7.513 8.584a2 2 0 1 0 2.827 2.83l8.588 -7.515z" />
</svg>
);
};

const ParachuteIcon = ({ className }: { className?: string }) => {
return (
<svg
xmlns="[http://www.w3.org/2000/svg](http://www.w3.org/2000/svg)"
width="24"
height="24"
viewBox="0 0 24 24"
fill="none"
stroke="currentColor"
strokeWidth="2"
strokeLinecap="round"
strokeLinejoin="round"
className={className}
>
<path stroke="none" d="M0 0h24v24H0z" fill="none" />
<path d="M22 12a10 10 0 1 0 -20 0" />
<path d="M22 12c0 -1.66 -1.46 -3 -3.25 -3c-1.8 0 -3.25 1.34 -3.25 3c0 -1.66 -1.57 -3 -3.5 -3s-3.5 1.34 -3.5 3c0 -1.66 -1.46 -3 -3.25 -3c-1.8 0 -3.25 1.34 -3.25 3" />
<path d="M2 12l10 10l-3.5 -10" />
<path d="M15.5 12l-3.5 10l10 -10" />
</svg>
);
};

// --- Component ---
import React from "react";
import {
ArrowRight,
Play,
Target,
Crown,
Star,
// Brand Icons
Hexagon,
Triangle,
Command,
Ghost,
Gem,
Cpu
} from "lucide-react";

// --- MOCK BRANDS ---
// Replaced PNGs with Lucide icons to simulate tech logos
const CLIENTS = [
{ name: "Acme Corp", icon: Hexagon },
{ name: "Quantum", icon: Triangle },
{ name: "Command+Z", icon: Command },
{ name: "Phantom", icon: Ghost },
{ name: "Ruby", icon: Gem },
{ name: "Chipset", icon: Cpu },
];

// --- SUB-COMPONENTS ---
const StatItem = ({ value, label }: { value: string; label: string }) => (
<div className="flex flex-col items-center justify-center transition-transform hover:-translate-y-1 cursor-default">
<span className="text-xl font-bold text-white sm:text-2xl">{value}</span>
<span className="text-[10px] uppercase tracking-wider text-zinc-500 font-medium sm:text-xs">{label}</span>
</div>
);

// --- MAIN COMPONENT ---
export default function HeroSection() {
return (
<div className="relative w-full bg-zinc-950 text-white overflow-hidden font-sans">
{/*
SCOPED ANIMATIONS
*/}
<style>{        `@keyframes fadeSlideIn {           from { opacity: 0; transform: translateY(20px); }           to { opacity: 1; transform: translateY(0); }         }         @keyframes marquee {           from { transform: translateX(0); }           to { transform: translateX(-50%); }         }         .animate-fade-in {           animation: fadeSlideIn 0.8s ease-out forwards;           opacity: 0;         }         .animate-marquee {           animation: marquee 40s linear infinite; /* Slower for readability */         }         .delay-100 { animation-delay: 0.1s; }         .delay-200 { animation-delay: 0.2s; }         .delay-300 { animation-delay: 0.3s; }         .delay-400 { animation-delay: 0.4s; }         .delay-500 { animation-delay: 0.5s; }`      }</style>

```
  {/* Background Image with Gradient Mask */}
  <div
    className="absolute inset-0 z-0 bg-[url(<https://cdn.21st.dev/assets/mirror/e2/e2d2c513457ef62bb85c6738b58f7155af95e4eca2512069220949168413635f.webp>)] bg-cover bg-center opacity-40"
    style={{
      maskImage: "linear-gradient(180deg, transparent, black 0%, black 70%, transparent)",
      WebkitMaskImage: "linear-gradient(180deg, transparent, black 0%, black 70%, transparent)",
    }}
  />

  <div className="relative z-10 mx-auto max-w-7xl px-4 pt-24 pb-12 sm:px-6 md:pt-32 md:pb-20 lg:px-8">
    <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-8 items-start">

      {/* --- LEFT COLUMN --- */}
      <div className="lg:col-span-7 flex flex-col justify-center space-y-8 pt-8">

        {/* Badge */}
        <div className="animate-fade-in delay-100">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 backdrop-blur-md transition-colors hover:bg-white/10">
            <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-zinc-300 flex items-center gap-2">
              Award-Winning Design
              <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
            </span>
          </div>
        </div>

        {/* Heading */}
        <h1
          className="animate-fade-in delay-200 text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-medium tracking-tighter leading-[0.9]"
          style={{
            maskImage: "linear-gradient(180deg, black 0%, black 80%, transparent 100%)",
            WebkitMaskImage: "linear-gradient(180deg, black 0%, black 80%, transparent 100%)"
          }}
        >
          Crafting Digital<br />
          <span className="bg-gradient-to-br from-white via-white to-[#ffcd75] bg-clip-text text-transparent">
            Experiences
          </span><br />
          That Matter
        </h1>

        {/* Description */}
        <p className="animate-fade-in delay-300 max-w-xl text-lg text-zinc-400 leading-relaxed">
          We design interfaces that combine beauty with functionality,
          creating seamless experiences that users love and businesses thrive on.
        </p>

        {/* CTA Buttons */}
        <div className="animate-fade-in delay-400 flex flex-col sm:flex-row gap-4">
          <button className="group inline-flex items-center justify-center gap-2 rounded-full bg-white px-8 py-4 text-sm font-semibold text-zinc-950 transition-all hover:scale-[1.02] hover:bg-zinc-200 active:scale-[0.98]">
            View Portfolio
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </button>

          <button className="group inline-flex items-center justify-center gap-2 rounded-full border border-white/10 bg-white/5 px-8 py-4 text-sm font-semibold text-white backdrop-blur-sm transition-colors hover:bg-white/10 hover:border-white/20">
            <Play className="w-4 h-4 fill-current" />
            Watch Showreel
          </button>
        </div>
      </div>

      {/* --- RIGHT COLUMN --- */}
      <div className="lg:col-span-5 space-y-6 lg:mt-12">

        {/* Stats Card */}
        <div className="animate-fade-in delay-500 relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl shadow-2xl">
          {/* Card Glow Effect */}
          <div className="absolute top-0 right-0 -mr-16 -mt-16 h-64 w-64 rounded-full bg-white/5 blur-3xl pointer-events-none" />

          <div className="relative z-10">
            <div className="flex items-center gap-4 mb-8">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 ring-1 ring-white/20">
                <Target className="h-6 w-6 text-white" />
              </div>
              <div>
                <div className="text-3xl font-bold tracking-tight text-white">150+</div>
                <div className="text-sm text-zinc-400">Projects Delivered</div>
              </div>
            </div>

            {/* Progress Bar Section */}
            <div className="space-y-3 mb-8">
              <div className="flex justify-between text-sm">
                <span className="text-zinc-400">Client Satisfaction</span>
                <span className="text-white font-medium">98%</span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-zinc-800/50">
                <div className="h-full w-[98%] rounded-full bg-gradient-to-r from-white to-zinc-400" />
              </div>
            </div>

            <div className="h-px w-full bg-white/10 mb-6" />

            {/* Mini Stats Grid */}
            <div className="grid grid-cols-3 gap-4 text-center">
              <StatItem value="5+" label="Years" />
              <div className="w-px h-full bg-white/10 mx-auto" />
              <StatItem value="24/7" label="Support" />
              <div className="w-px h-full bg-white/10 mx-auto" />
              <StatItem value="100%" label="Quality" />
            </div>

            {/* Tag Pills */}
            <div className="mt-8 flex flex-wrap gap-2">
              <div className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[10px] font-medium tracking-wide text-zinc-300">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                </span>
                ACTIVE
              </div>
              <div className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[10px] font-medium tracking-wide text-zinc-300">
                <Crown className="w-3 h-3 text-yellow-500" />
                PREMIUM
              </div>
            </div>
          </div>
        </div>

        {/* Marquee Card */}
        <div className="animate-fade-in delay-500 relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 py-8 backdrop-blur-xl">
          <h3 className="mb-6 px-8 text-sm font-medium text-zinc-400">Trusted by Industry Leaders</h3>

          <div
            className="relative flex overflow-hidden"
            style={{
              maskImage: "linear-gradient(to right, transparent, black 20%, black 80%, transparent)",
              WebkitMaskImage: "linear-gradient(to right, transparent, black 20%, black 80%, transparent)"
            }}
          >
            <div className="animate-marquee flex gap-12 whitespace-nowrap px-4">
              {/* Triple list for seamless loop */}
              {[...CLIENTS, ...CLIENTS, ...CLIENTS].map((client, i) => (
                <div
                  key={i}
                  className="flex items-center gap-2 opacity-50 transition-all hover:opacity-100 hover:scale-105 cursor-default grayscale hover:grayscale-0"
                >
                  {/* Brand Icon */}
                  <client.icon className="h-6 w-6 text-white fill-current" />
                  {/* Brand Name */}
                  <span className="text-lg font-bold text-white tracking-tight">
                    {client.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  </div>
</div>
```

);
}

// --- Demo ---
import React from 'react';
import HeroSection from '@/components/ui/glassmorphism-trust-hero';

export default function HeroDemo() {
return (
<div className="w-full h-screen overflow-y-auto bg-zinc-950">
<HeroSection />
</div>
);
}