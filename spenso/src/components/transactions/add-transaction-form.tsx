'use client'

import { Button, buttonVariants } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { transactionCategory, transactionType } from '@/config/dashboard'
import { useCurrencies } from '@/hooks/use-currencies'
import { cn, getRandomElement } from '@/lib/utils'
import { type TransactionInsert } from '@/types'
import { zodResolver } from '@hookform/resolvers/zod'
import { CalendarIcon } from '@radix-ui/react-icons'
import { format } from 'date-fns'
import { type Dispatch, type SetStateAction } from 'react'
import { useForm, type SubmitHandler } from 'react-hook-form'
import * as z from 'zod'
import { CurrencySelector } from '../currency-selector'
import { products } from '@/assets/data/products'

const formSchema = z.object({
  product: z.string().min(1, { message: 'Product is required.' }),
  date: z.date(),
  amount: z.coerce.number().transform((number) => Number(number.toFixed(2))),
  currency: z.string().min(3),
  type: z.string().min(1),
  category: z.string().min(1),
})

export const AddTransactionForm = ({
  setOpen,
  groupId,
  addTransaction,
}: {
  groupId?: string
  setOpen?: Dispatch<SetStateAction<boolean>>
  addTransaction: (formData: TransactionInsert) => unknown
}) => {
  const { data: currencies } = useCurrencies()

  const form = useForm<z.z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      product: '',
      date: new Date(),
      amount: 0,
      currency: 'BRL',
      type: transactionType[0],
      category: transactionCategory[0],
    },
  })

  const processForm: SubmitHandler<z.infer<typeof formSchema>> = async (values: z.infer<typeof formSchema>) => {
    const { date, ...valuesObj } = values
    const newValues = { date: new Date(date).toString(), ...valuesObj }

    await addTransaction({
      ...newValues,
      year: new Date(date).getFullYear().toString(),
      group_id: groupId ?? '',
    })

    setOpen?.(false)
  }

  const setRandomForm = async () => {
    form.setValue('product', getRandomElement(products, 'Key Holder'))
    form.setValue('date', new Date(new Date().valueOf() - Math.random() * 1e12)) // 1e12 same as 1000000000000
    form.setValue('amount', Number((Math.random() * 100000).toFixed(2)))
    form.setValue('type', getRandomElement(transactionType, 'income'))
    form.setValue('category', getRandomElement(transactionCategory, 'miscellaneous'))
    form.setValue('currency', getRandomElement(currencies ?? [], 'BRL'))
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(processForm)} className="space-y-8">
        <FormField
          control={form.control}
          name="product"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Product
                <Required />
              </FormLabel>
              <FormControl>
                <Input placeholder="Ex: Uni fan SL120" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>
                Transaction Date
                <Required />
              </FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={'outline'}
                      className={cn('w-[240px] pl-3 text-left font-normal', !field.value && 'text-muted-foreground')}
                    >
                      {field.value ? (
                        format(field.value, 'PPP')
                      ) : (
                        <span>
                          Pick a date
                          <Required />
                        </span>
                      )}
                      <CalendarIcon className="ml-auto size-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={(date) => date > new Date() || date < new Date('1900-01-01')}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex gap-2">
          <FormField
            control={form.control}
            name="amount"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>
                  Amount
                  <Required />
                </FormLabel>
                <FormControl>
                  <div className="flex items-center gap-2">
                    <Input className="" type="number" step=".01" placeholder="" {...field} />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="currency"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Currency
                  <Required />
                </FormLabel>
                <FormControl>
                  <div>
                    <Input className="hidden" placeholder="" {...field} />
                    <CurrencySelector
                      value={field.value}
                      onChange={(currency) => {
                        form.setValue('currency', currency)
                      }}
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Transaction Type
                <Required />
              </FormLabel>
              <Select value={form.getValues('type')} onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a transaction type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {transactionType.map((type) => {
                    return (
                      <SelectItem className="capitalize" key={type} value={type}>
                        {type}
                      </SelectItem>
                    )
                  })}
                </SelectContent>
              </Select>

              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Category
                <Required />
              </FormLabel>
              <Select value={form.getValues('category')} onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {transactionCategory.map((category) => {
                    return (
                      <SelectItem className="capitalize" key={category} value={category}>
                        {category}
                      </SelectItem>
                    )
                  })}
                </SelectContent>
              </Select>

              <FormMessage />
            </FormItem>
          )}
        />

        <div
          className={cn(
            'flex items-center justify-between',
            form.formState.isLoading ? 'pointer-events-none opacity-60' : null,
          )}
        >
          <span
            className={cn(
              buttonVariants({ size: 'sm', variant: 'ghost' }),
              form.formState.isLoading && 'pointer-events-none opacity-60',
              'cursor-pointer',
            )}
            onClick={setRandomForm}
          >
            Random
          </span>
          <Button size="sm" type="submit">
            Submit
          </Button>
        </div>
      </form>
    </Form>
  )
}

const Required = () => <span className="text-red-500"> *</span>
