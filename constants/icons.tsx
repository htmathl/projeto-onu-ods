import { AntDesign, Feather, SimpleLineIcons } from "@expo/vector-icons";

export const icon = {
    index: (props: any) => <SimpleLineIcons name='pie-chart' size={24} {...props} />,
    explore: (props: any) => <Feather name='plus' size={24} {...props} />,
    profile: (props: any) => <AntDesign name='swap' size={24} {...props} />,
}