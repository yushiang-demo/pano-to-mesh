# Pano-to-mesh

Our tool simplifies 3D panorama creation. You can annotate layouts, preview 3D meshes, export them with textures, arrange your media, share a viewer link for collaboration, and also experience immersive interaction through a first-person view.

## Quick start

### Development

```
yarn
yarn dev
```

### Production

- From Dockerfile

```
docker build . -t pano-to-mesh --no-cache
docker run -p 3000:3000 pano-to-mesh
```

- From Github Docker Registry

```
docker run -p 3000:3000 ghcr.io/yushiang-demo/pano-to-mesh
```

## Features

- Annotate Panorama Layout and Preview 3D Mesh.
- Export Mesh and Texture.
- Arrange Media and Share Viewer Link.
- First-Person View and Interact in Viewer.

|    [Panorama to mesh]    | [Mesh preview and download] |
| :----------------------: | :-------------------------: |
| ![2d.png](./docs/2d.png) |  ![3d.png](./docs/3d.png)   |

|    [Decoration with media]     |            [Viewer]             |
| :----------------------------: | :-----------------------------: |
| ![media.png](./docs/media.png) | ![view.png](./docs//viewer.png) |

> Demo image is provided by:
> https://as1.ftcdn.net/v2/jpg/01/89/08/78/1000_F_189087887_OBrl3f117Yicp94SBhFwMyxVgbN5Nfcb.jpg

[Panorama to mesh]: https://pano-to-mesh.vercel.app/editors/layout2d#eNpdkE9rwzAMxb-Lz8aWHP-Rcyyjt7WHwqCUENKsSTMyJ6TutjL23ecUtrDp8EPiPZ6EPlnTD8O0ZzlwVp-6vgttGlgmtGac9dVtuEb1wPLDAQTav5VxEIZcBriw4MmoQQM6Mg61mmlmo7fGAukf3o1Wg1WzmhqFuPCueufsvxQLhhTgL4uCs7EKw1S9Vunsc4zjJZeyuqBoYv0cRDhF-abky9hKQEleAklHEgGgXJdIHsgRuXK7mvqsQXT7rh693q3O6_fH28dTe9yYTVMfRUpgy67t1LVdSG8BjmJ-RPH1DUTpVnM
[Mesh preview and download]: https://pano-to-mesh.vercel.app/editors/layout3d#eNpdkE9rwzAMxb-Lz8aWHP-Rcyyjt7WHwqCUENKsSTMyJ6TutjL23ecUtrDp8EPiPZ6EPlnTD8O0ZzlwVp-6vgttGlgmtGac9dVtuEb1wPLDAQTav5VxEIZcBriw4MmoQQM6Mg61mmlmo7fGAukf3o1Wg1WzmhqFuPCueufsvxQLhhTgL4uCs7EKw1S9Vunsc4zjJZeyuqBoYv0cRDhF-abky9hKQEleAklHEgGgXJdIHsgRuXK7mvqsQXT7rh693q3O6_fH28dTe9yYTVMfRUpgy67t1LVdSG8BjmJ-RPH1DUTpVnM
[Decoration with media]: https://pano-to-mesh.vercel.app/editors/decoration#eNqtls9u20YQxl_F4JkmZ2Z3dmd9DIIAPTQpkCJA4BgGI1F_CkpUKbqNEfjQh-i9h75Arn2fouhb9FslrWUrdQzHgrGQxNHuzG-_-cbvi1nX98Pr4oTKYtIuu-V6jg-Fq7wvyqJrLvuLUZ4WJ6enVHG4-XIlVWrREV-vZyUCPXniaBrZS141B6aggcz_u-4Cg6cg-SneCPP1unuaYgy3dgmkJsT_rWdnZbFp1v3QrBqkvRjHzfakrpstV7NxMl1X63asf5L6h828Jq4t1WR1tJqJ6PzZOVsii2bx_MWToXMz5vh6Odkk__LJ4tnP316-ezV_-1yfzyZvK-xQXJ_1YljOl2tgoZKrDAJ5rNrpEkmcvi_GoVlvZ_2wasZlj6j3xabfLj--P3WVS55ZHVESF0jyDolCMk_khBw7X-6C1CdziQHW-4gDtpOma7GDVBIlBCW2EPE8OWxhKlG9-OSdOPJSHkZhix8vmrEd1h8zofIYkM2UgrKYx-_MSgJmVpCwTJ1cTDj8qizGyw0OL75v340AMbTNtF93l8XJrOm2bVlMm7HJlY75OcIWy-0R_pqjabvqjzbNvH2zfrP-88Ovf_3-x9-__VJcXZVfAEUVElcRZ8FDMUkNZboYjcgn1EqSoit9xQbhSXTGIYYsnT1QKA04TYJJRKUBOyThANrRODKYZ1C3ox4F1DczCKW9C9V2mCCuHtptfzFM2m29U1C1GFfdPfAcc4VmydJISWKwQClXxwBhXiGl4FMuLmoUhaiUNQLTHh6H9KPzEAmbU3U-ItwJOFBmap6h7MOgQzq4KZyXJAlam5Jq2sHRBCIaPXo4sPd7bF4tp23_ADSrjb8PGalol33KVoNryddulrODZ5AFpOXzlYrzGjXBWjgxJ_E3tOMNJWt2IMiQc5vG4INIhq0efFx5EPQIbF4ummk7HH0NIlh53_VDcYKOwJ2z3oMZvNUUNMxxUgc73_UKPianAockg75ANmXx086wnKRwgxh0El2K8H6PRXa2FBy2grOFbEak5WHU55gx0sYNGqcYkI_smKFbWfMPDezNuf1mW8FgHkBrs57fQ1AwaBzpBc3GDo7ssxY4Dyd2AY6kWh473DNQZ0GFSJFIb6DBtIJ4kD18HVa_c7Ls1lBS0JhEc6veCnoMMJ_U9DV8HqAmrkAgYfDAViM8E9ZNFebdjZcL-FIAQVC1aDZlirda0KtTDDQPEUmkzAj_MQQARrdyCuYiSAqMG8hT9GQYqwcGBW3jMdjivpCTovEytvLg67AH7ruumbSLvsv03NM70H2Zhq_gOrgvVAErxoDWrB9FBZgbMFuHHFL2I59t2vLFAp9CCnswQoU7Bsg8yHNXhswCoZzQrmLJ0FsHMZ8dZHD3rDLxmK36SUEYezHgG8yNiFGW_geE3A3i7OofCnPHXg
[Viewer]: https://pano-to-mesh.vercel.app#eNqtls9u20YQxl_F4JkmZ2Z3dmd9DIIAPTQpkCJA4BgGI1F_CkpUKbqNEfjQh-i9h75Arn2fouhb9FslrWUrdQzHgrGQxNHuzG-_-cbvi1nX98Pr4oTKYtIuu-V6jg-Fq7wvyqJrLvuLUZ4WJ6enVHG4-XIlVWrREV-vZyUCPXniaBrZS141B6aggcz_u-4Cg6cg-SneCPP1unuaYgy3dgmkJsT_rWdnZbFp1v3QrBqkvRjHzfakrpstV7NxMl1X63asf5L6h828Jq4t1WR1tJqJ6PzZOVsii2bx_MWToXMz5vh6Odkk__LJ4tnP316-ezV_-1yfzyZvK-xQXJ_1YljOl2tgoZKrDAJ5rNrpEkmcvi_GoVlvZ_2wasZlj6j3xabfLj--P3WVS55ZHVESF0jyDolCMk_khBw7X-6C1CdziQHW-4gDtpOma7GDVBIlBCW2EPE8OWxhKlG9-OSdOPJSHkZhix8vmrEd1h8zofIYkM2UgrKYx-_MSgJmVpCwTJ1cTDj8qizGyw0OL75v340AMbTNtF93l8XJrOm2bVlMm7HJlY75OcIWy-0R_pqjabvqjzbNvH2zfrP-88Ovf_3-x9-__VJcXZVfAEUVElcRZ8FDMUkNZboYjcgn1EqSoit9xQbhSXTGIYYsnT1QKA04TYJJRKUBOyThANrRODKYZ1C3ox4F1DczCKW9C9V2mCCuHtptfzFM2m29U1C1GFfdPfAcc4VmydJISWKwQClXxwBhXiGl4FMuLmoUhaiUNQLTHh6H9KPzEAmbU3U-ItwJOFBmap6h7MOgQzq4KZyXJAlam5Jq2sHRBCIaPXo4sPd7bF4tp23_ADSrjb8PGalol33KVoNryddulrODZ5AFpOXzlYrzGjXBWjgxJ_E3tOMNJWt2IMiQc5vG4INIhq0efFx5EPQIbF4ummk7HH0NIlh53_VDcYKOwJ2z3oMZvNUUNMxxUgc73_UKPianAockg75ANmXx086wnKRwgxh0El2K8H6PRXa2FBy2grOFbEak5WHU55gx0sYNGqcYkI_smKFbWfMPDezNuf1mW8FgHkBrs57fQ1AwaBzpBc3GDo7ssxY4Dyd2AY6kWh473DNQZ0GFSJFIb6DBtIJ4kD18HVa_c7Ls1lBS0JhEc6veCnoMMJ_U9DV8HqAmrkAgYfDAViM8E9ZNFebdjZcL-FIAQVC1aDZlirda0KtTDDQPEUmkzAj_MQQARrdyCuYiSAqMG8hT9GQYqwcGBW3jMdjivpCTovEytvLg67AH7ruumbSLvsv03NM70H2Zhq_gOrgvVAErxoDWrB9FBZgbMFuHHFL2I59t2vLFAp9CCnswQoU7Bsg8yHNXhswCoZzQrmLJ0FsHMZ8dZHD3rDLxmK36SUEYezHgG8yNiFGW_geE3A3i7OofCnPHXg
